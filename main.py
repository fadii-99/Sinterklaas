from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from routers import early_access, purchases, welcome_messages, payments
from apscheduler.schedulers.background import BackgroundScheduler
# from utils import send_whatsapp_video,send_email_with_video
from database import get_db_connection 
import requests
import os
from dotenv import load_dotenv
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from celery_app import process_pending_videos
from email.mime.base import MIMEBase
from email import encoders
from celery_app import process_pending_videos
# from utils import payments
load_dotenv()

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

ACCESS_TOKEN = "EAALyPvU2Hp4BO7CilpmeLHCVBUSbMKAAzCpkKh4kM8R5GkHFLDJR7E2r8dZCn9PSwW5B8iRfESEh0jNqtvFreZBI8d2WYTTfaNEsD8gSR8wbZBWIZCrEbesnVZAu1j6i6iHhbk0CWbaFx2kVt122tlWvJtFfeZB7lDR7GCNJMMqosP2ZBXIWt0uMKKuZBEHrzgbhu8QW0S6M6RxJW0rnx3XZAWeb4OEgZD"
WHATSAPP_API_URL = "https://graph.facebook.com/v20.0/431326530069965"



# def send_video_message(phone_number, media_id):
#     """Sends a video message via WhatsApp."""
#     url = f"{WHATSAPP_API_URL}/messages"
#     headers = {
#         "Authorization": f"Bearer {ACCESS_TOKEN}",
#         "Content-Type": "application/json"
#     }
#     payload = {
#         "messaging_product": "whatsapp",
#         "to": phone_number,
#         "type": "video",
#         "video": {
#             "id": media_id
#         }
#     }

#     response = requests.post(url, headers=headers, json=payload)

#     if response.status_code == 200:
#         print(f"Message sent successfully to {phone_number}.")
#         return True
#     else:
#         print(f"Failed to send message: {response.text}")
#         return False





scheduler = BackgroundScheduler()


def send_on_email(email, video):
    print(video)
    email_host = os.getenv('EMAIL_HOST')
    email_port = int(os.getenv('EMAIL_PORT'))
    email_user = os.getenv('EMAIL_USER')
    email_pass = os.getenv('EMAIL_PASS')

    # Create the email message
    msg = MIMEMultipart('alternative')
    msg['From'] = email_user
    msg['To'] = email
    msg['Subject'] = 'Gifted Video'

   

    html_body = """
    <html>
    <body>
        <p>Hi there!</p>
        <p>Enjoy your gifted video!</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(html_body, 'html'))

    # Attach the video file
    try:
        print(video)
        with open(video, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename={video}',
            )
            msg.attach(part)
    except Exception as e:
        print(f"Error attaching the video file: {str(e)}")
        return

    # Send the email
    try:
        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()
            server.login(email_user, email_pass)
            server.sendmail(email_user, msg['To'], msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {str(e)}")


    
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

def send_on_whatsapp(phone, video):

    media_id = upload_video(video)

    if media_id:
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
            SELECT receiver_phone, receiver_email  
            FROM video_purchases 
            WHERE id = %s;
        """
        cursor.execute(purchase_query, (pending_video['purchase_id'],))
        purchase = cursor.fetchone()
        
        if purchase:
            phone_numbers = purchase['receiver_phone'].split(',') if purchase['receiver_phone'] and purchase['receiver_phone'] != 'null' else []
            email_addresses = purchase['receiver_email'].split(',') if purchase['receiver_email'] and purchase['receiver_email'] != 'null' else []

            if email_addresses:
                for email in email_addresses:
                    if send_on_email(email.strip(), pending_video['final_video_path']):
                        update_query = """
                            UPDATE final_videos 
                            SET send_status = 'sent' 
                            WHERE id = %s;
                        """
                        cursor.execute(update_query, (pending_video['id'],))
                        connection.commit()
                        print(f"Video ID {pending_video['id']} marked as sent via email to {email.strip()}.")
                        break  
            
            # if phone_numbers:
            #     for phone in phone_numbers:
            #         if send_on_whatsapp(phone, os.path.basename(pending_video['final_video_path'])):
            #             update_query = """
            #                 UPDATE final_videos 
            #                 SET send_status = 'sent' 
            #                 WHERE id = %s;
            #             """
            #             cursor.execute(update_query, (pending_video['id'],))
            #             connection.commit()
            #             print(f"Video ID {pending_video['id']} marked as sent via phone to {phone.strip()}.")
            #             break  
        else:
            print("No purchase information found for the pending video.")
    else:
        print("No pending videos to process.")





def dummy():
    process_pending_videos.delay()
# scheduler.add_job(load_pending_video, 'interval', seconds=5)
scheduler.add_job(dummy, 'interval', seconds=1800)

# scheduler.start()

# def shutdown_event():
#     """Shutdown the scheduler when the app stops."""
#     scheduler.shutdown()

# shutdown_event()