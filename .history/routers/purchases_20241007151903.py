from fastapi import APIRouter, Depends, HTTPException, FileResponse, BackgroundTasks
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
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
        
        background_tasks.add_task(generate_voice, text, task_id)
        
        return {"message": "Voice generation started.", "task_id": task_id}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in generate_voice_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating and sending voice: {e}")



@router.get("/task-status/")
async def get_task_status(task_id: str):
    status = task_status.get(task_id, "Not Found")

    if status == "Completed":
        file_path = f"static/generated_audios/{task_id}.mp3"
        
        if os.path.exists(file_path):
            response = FileResponse(file_path, media_type='audio/mpeg')
            response.headers["Content-Disposition"] = f"attachment; filename={os.path.basename(file_path)}"
            return response
    
    return {"task_id": task_id, "status": status}





scheduler = BackgroundScheduler()

def check_scheduled_videos():
    with get_db() as db:
        cursor = db.cursor()
        query = """
            SELECT id, user_email, receiver_phone, send_date, video_name
            FROM video_purchases
            WHERE payment_status = 'pending'
        """
        cursor.execute(query)
        purchases = cursor.fetchall()

        current_time = datetime.now()
        for purchase in purchases:
            send_date = purchase['send_date']
            if send_date <= current_time:
                # Call your method to send the video
                send_whatsapp_video(purchase['receiver_phone'], purchase['video_name'])
                
                # Update payment status to 'completed'
                update_query = """
                    UPDATE video_purchases
                    SET payment_status = 'completed'
                    WHERE id = %s
                """
                cursor.execute(update_query, (purchase['id'],))
                db.commit()
        
        cursor.close()

# Add the job to the scheduler to run every minute
scheduler.add_job(check_scheduled_videos, IntervalTrigger(minutes=1))

# Start the scheduler
scheduler.start()





























































































