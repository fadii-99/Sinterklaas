from fastapi import APIRouter, Depends, HTTPException, FileResponse, BackgroundTasks
from sqlalchemy.orm import Session
from database import get_db
import uuid
from schemas import VideoPurchaseSchema
from routers.payments import create_payment
from dotenv import load_dotenv
import os
from datetime import datetime
from utils.Voice import generate_voice, start_background_task

load_dotenv()


router = APIRouter()

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchaseSchema, db: Session = Depends(get_db)):
    try:
        # Insert the data into the video_purchases table
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
        # Create a unique task ID
        task_id = str(uuid.uuid4())
        
        # Set task status to 'In Progress'
        task_status[task_id] = "In Progress"
        
        # Add the voice generation task to background tasks
        background_tasks.add_task(generate_voice, text, task_id)
        
        # Return the task ID to the user
        return {"message": "Voice generation started.", "task_id": task_id}

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in generate_voice_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating and sending voice: {e}")

@router.get("/task-status/")
async def get_task_status(task_id: str):
    # Get the task status from the dictionary
    status = task_status.get(task_id, "Not Found")
    return {"task_id": task_id, "status": status}