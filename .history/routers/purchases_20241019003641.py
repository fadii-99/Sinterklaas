from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File, Form
from fastapi.responses import FileResponse, JSONResponse
from sqlalchemy.orm import Session
from database import get_db
from typing import List
import uuid
from schemas import VideoPurchaseSchema, promptVoice, taskStatus
from routers.payments import create_payment
from dotenv import load_dotenv
import os
import json
import requests
import asyncio
from datetime import datetime
from utils import send_whatsapp_video

load_dotenv()


router = APIRouter()

def save_files(user_email: str, files: List[UploadFile], folder: str):
    """Save uploaded files and return their paths."""
    paths = []
    user_folder = f"static/{folder}/{user_email}"
    os.makedirs(user_folder, exist_ok=True)

    for file in files:
        file_path = os.path.join(user_folder, file.filename)
        with open(file_path, "wb") as f:
            f.write(file.file.read())
        paths.append(file_path)

    return paths



@router.post("/purchase-video/")
async def purchase_video(
    user_email: str = Form(...),
    receiver_phone: str = Form(...),
    send_date: str = Form(...),
    video_name: str = Form(...),
    voice_path: str = Form(...),
    amount: str = Form(...),
    files: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    try:
        print(f'Voice path: {voice_path}')
        # voice_file_path = f"static/generated_audios/{voice_path}.mp3"
        voice_file_path = f"static/generated_audios/b6cbfc78-90eb-4aa6-9147-fb2398723639.mp3"
        
        if not os.path.exists(voice_file_path):
            raise HTTPException(status_code=400, detail="Voice file not found")

        # Separate images and videos based on MIME type
        image_files = [file for file in files if file.content_type.startswith('image/')]
        video_files = [file for file in files if file.content_type.startswith('video/')]

        image_paths = save_files(user_email, image_files, "images")
        video_paths = save_files(user_email, video_files, "videos")

        insert_purchase_query = """
        INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status, voice_path)
        VALUES (%s, %s, %s, %s, %s, %s)
        """
        cursor = db.cursor()
        cursor.execute(insert_purchase_query, (
            user_email,
            ','.join(json.loads(receiver_phone)),  # Ensure the list is correctly joined
            send_date,
            video_name,
            'pending',
            voice_file_path
        ))
        purchase_id = cursor.lastrowid  # Retrieve the last inserted ID

        insert_file_path_query = """
        INSERT INTO video_files (purchase_id, file_type, file_path)
        VALUES (%s, %s, %s)
        """
        for image_path in image_paths:
            cursor.execute(insert_file_path_query, (purchase_id, "image", image_path))
        for video_path in video_paths:
            cursor.execute(insert_file_path_query, (purchase_id, "video", video_path))

        db.commit()
        cursor.close()

        ret = create_payment(amount, video_name)

        return ret

    except Exception as e:
        print(f"Error in purchase_video: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")


    
        # ret = create_payment(purchase.amount, purchase.video_name)




def check_quota():
    url = "https://api.elevenlabs.io/v1/user/usage"
    headers = {
        "xi-api-key": XI_API_KEY
    }
    response = requests.get(url, headers=headers)
    if response.ok:
        usage = response.json()
        remaining_credits = usage.get("remaining_characters", 0)
        print(f"Remaining Credits: {remaining_credits}")
        return remaining_credits
    else:
        print("Failed to retrieve quota info.")
        return 0




XI_API_KEY = os.environ.get('XI_API_KEY')
VOICE_ID = os.environ.get('VOICE_ID')
CHUNK_SIZE = 1024


task_status = {}  # A global dictionary to track the status of tasks

async def generate_voice(text: str, task_id: str):
    print('\nGenerating voice\n')
    try:
        OUTPUT_DIR = "static/generated_audios"
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file_path = os.path.join(OUTPUT_DIR, f"{task_id}.mp3")
        
        tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"

        headers = {
            "Accept": "application/json",
            "xi-api-key": XI_API_KEY
        }

        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.0,
                "use_speaker_boost": True
            }
        }

        response = requests.post(tts_url, headers=headers, json=data, stream=True)

        if response.ok:
            with open(output_file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    f.write(chunk)
            print("Audio stream saved successfully.")
            task_status[task_id] = "Completed"
            return output_file_path, task_status
        else:
            print(response.text)
            task_status[task_id] = f"Failed: {response.text}"
            return None
    except Exception as e:
        print(f"Error generating voice: {e}")
        task_status[task_id] = f"Failed: {e}"
        return None

def start_background_task(text: str, task_id: str):
    # Use `asyncio.run` to execute the async function from a synchronous context
    asyncio.run(generate_voice(text, task_id))

@router.post("/generate-voice/")
async def generate_voice_endpoint(data: dict, background_tasks: BackgroundTasks):
    try:
        task_id = str(uuid.uuid4())
        task_status[task_id] = "In Progress"

        background_tasks.add_task(start_background_task, data['prompt'], task_id)

        return JSONResponse({"message": "Voice generation started.", "task_id": task_id})

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in generate_voice_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating and sending voice: {e}")




@router.post("/task-status/")
async def get_task_status(data: taskStatus):
    status = task_status.get(data.task_id)

    if status == "Completed":
        del task_status[data.task_id]
        file_path = f"static/generated_audios/{data.task_id}.mp3"
        
        if os.path.exists(file_path):
            response = FileResponse(file_path, media_type='audio/mpeg')
            response.headers["Content-Disposition"] = f"attachment; filename={os.path.basename(file_path)}"
            return response
    
    return JSONResponse({"task_id": data.task_id, "status": status})



@router.get("/whastapp/")
async def whastapp():
    
    return {"message": send_whatsapp_video('+923480952114', 'WhatsApp Video 2024-09-29 at 2.14.44 PM.mp4' )}































































































