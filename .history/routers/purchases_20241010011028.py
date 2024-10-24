from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, UploadFile, File
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
from typing import List
import uuid
from schemas import VideoPurchaseSchema
from static.payments import create_payment
from dotenv import load_dotenv
import os
from datetime import datetime
from utils.Voice import generate_voice, start_background_task
from utils.whatsapp import send_whatsapp_video

load_dotenv()


router = APIRouter()

def save_files(user_email: str, files: List[UploadFile], file_type: str):
    saved_paths = []
    upload_dir = f"static/uploaded_data/{user_email}/{file_type}"
    
    # Ensure the directory exists
    os.makedirs(upload_dir, exist_ok=True)
    
    for file in files:
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        file_extension = file.filename.split('.')[-1]
        file_name = f"{user_email}_{timestamp}.{file_extension}"
        file_path = os.path.join(upload_dir, file_name)
        
        with open(file_path, "wb") as buffer:
            buffer.write(file.file.read())
        
        saved_paths.append(file_path)
    
    return saved_paths

@router.post("/purchase-video/")
async def purchase_video(
    purchase: VideoPurchaseSchema,
    images: List[UploadFile] = File(...),
    videos: List[UploadFile] = File(...),
    db: Session = Depends(get_db)
):
    try:
        voice_file_path = f"static/generated_audios/{purchase.video_name}.mp3"
        
        if not os.path.exists(voice_file_path):
            raise HTTPException(status_code=400, detail="Voice file not found")
        
        image_paths = save_files(purchase.user_email, images, "images")
        video_paths = save_files(purchase.user_email, videos, "videos")
        
        insert_purchase_query = """
        INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status, voice_path)
        VALUES (%s, %s, %s, %s, %s, %s)
        RETURNING id
        """
        cursor = db.cursor()
        cursor.execute(insert_purchase_query, (
            purchase.user_email,
            ','.join(purchase.receiver_phone),  
            purchase.send_date,
            purchase.video_name,
            'pending',
            voice_file_path
        ))
        purchase_id = cursor.fetchone()[0]  

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

        return {"message": "Purchase and files saved successfully.", "purchase_id": purchase_id}

    except Exception as e:
        print(f"Error in purchase_video: {e}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    


task_status = {}

@router.post("/generate-voice/")
async def generate_voice_endpoint(text: str, background_tasks: BackgroundTasks):
    try:
        task_id = str(uuid.uuid4())
        
        task_status[task_id] = "In Progress"
        
        background_tasks.add_task(start_background_task(text, task_id, task_status))
        
        return {"message": "Voice generation started.", "task_id": task_id}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in generate_voice_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating and sending voice: {e}")




@router.post("/task-status/")
async def get_task_status(task_id: str):
    status = task_status.get(task_id, "Not Found")

    if status == "Completed":
        file_path = f"static/generated_audios/{task_id}.mp3"
        
        if os.path.exists(file_path):
            response = FileResponse(file_path, media_type='audio/mpeg')
            response.headers["Content-Disposition"] = f"attachment; filename={os.path.basename(file_path)}"
            return response
    
    return {"task_id": task_id, "status": status}


@router.get("/whastapp/")
async def whastapp():
    
    return {"message": send_whatsapp_video('+923480952114', 'WhatsApp Video 2024-09-29 at 2.14.44 PM.mp4' )}
































































































