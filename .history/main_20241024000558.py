from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from routers import early_access, purchases, welcome_messages, payments
from apscheduler.schedulers.background import BackgroundScheduler
from utils import send_whatsapp_video,send_email_with_video
from database import get_db_connection 
import requests
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

ACCESS_TOKEN = "EAALyPvU2Hp4BO7vqQg3q2T5wnF4khnbuUoXZAhr3V8RdrwsyjZBXBq9EtJsZAMJgXSZCgPcGEZBjzs17wSaZBZAwjZBth0i9sNfhCwGojRuYMMPyo1ghT5vxAxyCeqMWSqBsPBXnLZAbgcUWMWcCzaxubTXGbwzMhpn1EMnrSkL9Mg6s88pFA4K2kGorkDBZAMD2UmZC6koAtAGhH4FBgyKZAZBcUtQmmI5IZD"
WHATSAPP_API_URL = "https://graph.facebook.com/v20.0/431326530069965"

def upload_video(file_path):
    url = f"{WHATSAPP_API_URL}/media"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}"
    }
    files = {
        "file": (file_path, open(file_path, "rb"), "video/mp4"),
        "messaging_product": (None, "whatsapp")
    }

    response = requests.post(url, headers=headers, files=files)

    if response.status_code == 200:
        media_id = response.json().get("id")
        print(f"Video uploaded successfully. Media ID: {media_id}")
        return media_id
    else:
        print(f"Failed to upload video: {response.text}")
        return None

def send_video_message(phone_number, media_id):
    """Sends a video message via WhatsApp."""
    url = f"{WHATSAPP_API_URL}/messages"
    headers = {
        "Authorization": f"Bearer {ACCESS_TOKEN}",
        "Content-Type": "application/json"
    }
    payload = {
        "messaging_product": "whatsapp",
        "to": phone_number,
        "type": "video",
        "video": {
            "id": media_id
        }
    }

    response = requests.post(url, headers=headers, json=payload)

    if response.status_code == 200:
        print(f"Message sent successfully to {phone_number}.")
        return True
    else:
        print(f"Failed to send message: {response.text}")
        return False

# Example usage:
# Step 1: Upload the video and get the media ID
media_id = upload_video("/home/fawad/Desktop/PYTHON/sinter_backend/static/generated_videos/final_sample_voice.mp4")

# Step 2: Send the video message using the media ID
if media_id:
    send_video_message("923480952114", media_id)



scheduler = BackgroundScheduler()


def send_message():


    return True

def load_pending_video():
    connection = get_db_connection() 
    cursor = connection.cursor(dictionary=True) 
    query = """
        SELECT id, purchase_id, final_video_path, send_status 
        FROM final_videos 
        WHERE send_status = 'pending' 
        ORDER BY id ASC 
        LIMIT 1;
    """
    cursor.execute(query)
    pending_video = cursor.fetchone()

    if pending_video:
        print(f"Processing video: {pending_video['final_video_path']}")

        purchase_query = """
                    SELECT receiver_phone 
                    FROM video_purchases 
                    WHERE id = %s;
                """
        cursor.execute(purchase_query, (pending_video['purchase_id'],))
        purchase = cursor.fetchone()
        if purchase:

            if send_message(purchase['receiver_phone'], pending_video['final_video_path']):
                update_query = """
                    UPDATE final_videos 
                    SET send_status = 'sent' 
                    WHERE id = %s;
                """
                cursor.execute(update_query, (pending_video['id'],))
                connection.commit()
                print(f"Video ID {pending_video['id']} marked as sent.")
    else:
        print("No pending videos to process.")




# Schedule the job to run every 10 seconds
scheduler.add_job(load_pending_video, 'interval', seconds=10)

# Start the scheduler
scheduler.start()

# def shutdown_event():
#     """Shutdown the scheduler when the app stops."""
#     scheduler.shutdown()

# shutdown_event()