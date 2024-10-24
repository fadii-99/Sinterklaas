from fastapi import APIRouter, BackgroundTasks
from utils import send_whatsapp_video


router = APIRouter()

@router.get("/send-video/")
async def send_video(background_tasks: BackgroundTasks):
    background_tasks.add_task(start_background_task)
    return {"message": "Welcome messages are being sent in the background."}
