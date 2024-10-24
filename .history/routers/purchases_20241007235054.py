from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from database import get_db
import uuid
from schemas import VideoPurchaseSchema
from routers.payments import create_payment
from dotenv import load_dotenv
import os
from datetime import datetime
from utils.Voice import generate_voice, start_background_task
from utils.whatsapp import send_whatsapp_video

load_dotenv()


router = APIRouter()

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchaseSchema, db: Session = Depends(get_db)):
    try:
        cursor = db.cursor()
        insert_query = """
            INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            purchase.user_email,
            purchase.receiver_phone,
            purchase.send_date,
            purchase.video_name,
            'pending' 
        ))
        db.commit()
        cursor.close()
        ret = create_payment(purchase.amount, purchase.video_name)

        return ret
    except Exception as e:
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
































































































