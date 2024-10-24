from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from routers import early_access, purchases, welcome_messages, payments
from apscheduler.schedulers.background import BackgroundScheduler
from utils import send_whatsapp_video,send_email_with_video

# from utils import payments


app = FastAPI()
cache = LRUCache(maxsize=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(early_access.router)
app.include_router(payments.router)
app.include_router(purchases.router)
app.include_router(welcome_messages.router)





scheduler = BackgroundScheduler()

def send_message():
    # receiver_phone = "923480952114"  # Replace with actual recipient's phone number
    # video_path = "/home/fawad/Desktop/PYTHON/sinter_backend/static/generated_videos/fawdmuhammad14@gmail.com_2024-10-19 11:12:49.mp4"  # Replace with the actual video path
    # response = send_whatsapp_video(receiver_phone, video_path)
    # print(f"WhatsApp message response: {response}")
    to_email = "recipient@example.com"  # Replace with recipient's email address
    subject = "Here is your video!"
    body = "Hi, please find the attached video."
    video_path = "/home/fawad/Downloads/test.mp4"  # Path to the video file

    response = send_email_with_video(to_email, subject, body, video_path)

# Add the job to run every 10 seconds
scheduler.add_job(send_message, 'interval', seconds=10)

# Start the scheduler
scheduler.start()

def shutdown_event():
    """Shutdown the scheduler when the app stops."""
    scheduler.shutdown()

# shutdown_event()