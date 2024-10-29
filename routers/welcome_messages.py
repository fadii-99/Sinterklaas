from fastapi import APIRouter, BackgroundTasks
from utils import start_background_task

router = APIRouter()

@router.get("/send-welcome-messages/")
async def send_welcome_messages(background_tasks: BackgroundTasks):
    background_tasks.add_task(start_background_task)
    return {"message": "Welcome messages are being sent in the background."}
