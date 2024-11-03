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

def save_files(user_email: str, folder_date,  files: List[UploadFile], folder: str):
    """Save uploaded files and return their paths."""
    paths = []
    user_folder = f"static/{folder}/{user_email}/{folder_date}"
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
    receiver_email: str = Form(...),
    send_date: str = Form(...),
    video_name: str = Form(...),
    amount: str = Form(...),
    files: List[UploadFile] = File(...),
    name: str = Form(...),
    age: str = Form(...),  
    hobby: str = Form(...),
    db=Depends(get_db),
    friends_names: str = Form(...),
    family_names: str = Form(...),
    school_name: str = Form(...),
    teacher_name: str = Form(...),
    favourite_subject: str = Form(...) 
):
    try:

        cursor = db.cursor(dictionary=True)

        insert_purchase_query = """
        INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status, voice_path, name, age, hobby, friends_names, family_names, school_name, teacher_name, favorite_subject,receiver_email)
        VALUES (%s, %s, %s, %s, %s, %s,%s, %s, %s, %s, %s,%s, %s, %s, %s)
        """
        cursor.execute(insert_purchase_query, (
            user_email,
            receiver_phone,
            send_date,
            video_name,
            'pending', 
            'null',      
            name,
            age,
            hobby,
            friends_names,
            family_names,
            school_name,
            teacher_name,
            favourite_subject, 
            receiver_email 
        ))

        purchase_id = cursor.lastrowid

        cursor.execute("SELECT created_at FROM video_purchases WHERE id = %s", (purchase_id,))
        created_at = cursor.fetchone()['created_at']

        folder_date = created_at.strftime('%Y-%m-%d')
        print(f"Folder date: {folder_date}")

        image_files = [file for file in files if file.content_type.startswith('image/')]

        image_paths = save_files(user_email, folder_date, image_files, "images")

        insert_file_path_query = """
        INSERT INTO video_files (purchase_id, file_type, file_path)
        VALUES (%s, %s, %s)
        """
        for path in image_paths:
            cursor.execute(insert_file_path_query, (purchase_id, "image", path))

        db.commit()
        cursor.close()

        ret = create_payment(amount, video_name, user_email,purchase_id, db)
        print(f"Payment response: {ret}")

        return ret

    except Exception as e:
        print(f"Error in purchase_video: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

    






@router.post("/redeem_coupon/")
def redeem_coupon(coupon: str = Form(...), db=Depends(get_db)):
    cursor = db.cursor()

    cursor.execute("SELECT * FROM early_access WHERE coupon = %s AND used = FALSE", (coupon,))
    coupon_entry = cursor.fetchone()

    if not coupon_entry:
        return JSONResponse(status_code=400, content={"error": "Invalid or already used coupon."})
    print(coupon)
    print(coupon_entry)

    if coupon_entry[4] == 1:  
        return JSONResponse(status_code=400, content={"error": "Invalid or already used coupon."})

    cursor.execute("UPDATE early_access SET used = TRUE WHERE coupon = %s", (coupon,))
    db.commit()
    cursor.close()

    return JSONResponse(status_code=200, content={"message": "Coupon redeemed successfully!"})















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
    name = 'Muhammad Fawad Abbasi'
    age = 25 # Ensuring age is an integer
    hobby= 'Playing football'
    text = f"Ohhh, hello there! How wonderful that I get to record a very special message just for you, {name}! You know, I’ve just looked into my big book, and I’ve read so much about you. But first, I want to tell you how happy I am that it’s almost Sinterklaas Eve! What an exciting time, right? With pepernoten, gifts, and so much fun! Well,<break time='1s'/> {name} I heard you’re already {age}, years old! You’re growing up so fast! And do you know what else I know? You love {hobby}, is that right? That’s so much fun!"
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
                "stability": 0.32,
                "similarity_boost": 0.76,
                "style": 0.78,
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

@router.post("/clone-voice/")
async def clone_voice(file: UploadFile = File(...)):
    # Save the uploaded file locally
    file_path = f"static/{file.filename}"
    with open(file_path, "wb") as f:
        f.write(await file.read())

    # Prepare the data for Eleven Labs API
    url = "https://api.elevenlabs.io/v1/voices/clone"
    headers = {
        # "Accept": "application/json",
        "xi-api-key": XI_API_KEY
    }
    with open(file_path, "rb") as f:
        files_data = {"files": (file.filename, f)}
        payload = {"name": "sinterklaas", "description": "A cloned voice of sinterklaas"}

        # Make the API call
        response = requests.post(url, headers=headers, data=payload, files=files_data, verify=False)

    # Handle the response
    if response.ok:
        global CLONED_VOICE_ID
        CLONED_VOICE_ID = response.json().get("voice_id")
        return JSONResponse({"message": "Voice cloned successfully", "voice_id": CLONED_VOICE_ID})
    else:
        return JSONResponse({"error": response.text}, status_code=response.status_code)



@router.post("/clone-voice/")
async def clone_voice(file: UploadFile = File(...)):
    # try:
        # Save the uploaded file locally
        file_path = f"static/{file.filename}"
        with open(file_path, "wb") as f:
            f.write(await file.read())

        # Prepare the data for Eleven Labs API
        url = "https://api.elevenlabs.io/v1/voices/clone"
        headers = {
            "xi-api-key": XI_API_KEY
        }
        with open(file_path, "rb") as f:
            files_data = {"files": (file.filename, f)}
            payload = {"name": "sinterklaas", "description": "A cloned voice of sinterklaas"}

            # Make the API call
            response = requests.post(url, headers=headers, data=payload, files=files_data)

        # Handle the response
        if response.ok:
            global CLONED_VOICE_ID
            CLONED_VOICE_ID = response.json().get("voice_id")
            return JSONResponse({"message": "Voice cloned successfully", "voice_id": CLONED_VOICE_ID})
        else:
            return JSONResponse({"error": response.text}, status_code=response.status_code)

    # except Exception as e:
    #     return JSONResponse({"error": str(e)}, status_code=500)

@router.get("/whastapp/")
async def whastapp():
    
    return {"message": send_whatsapp_video('+923480952114', 'WhatsApp Video 2024-09-29 at 2.14.44 PM.mp4' )}




# url1 = "https://api.elevenlabs.io/v1/voices"

# headers = {
#     "Accept": "application/json",
#     "xi-api-key": XI_API_KEY
# }

# response = requests.get(url1, headers=headers)

# if response.ok:
#     data = response.json()  # Parse the entire response
#     voices = data.get("voices", [])  # Extract the list of voices

#     if voices:
#         print("Available Voices:")
#         for voice in voices:
#             print(f"Name: {voice['name']}, ID: {voice['voice_id']}")
#     else:
#         print("No voices found.")
# else:
#     print(f"Failed to get voices: {response.status_code} - {response.text}")



























































































