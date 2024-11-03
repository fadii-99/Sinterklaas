from fastapi import FastAPI, HTTPException,File, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from routers import early_access, purchases, welcome_messages, payments, admin
from apscheduler.schedulers.background import BackgroundScheduler
# from utils import send_whatsapp_video,send_email_with_video
from database import get_db_connection 
import requests
from fastapi.staticfiles import StaticFiles
import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from celery_app import process_pending_videos
from email.mime.base import MIMEBase
from email import encoders
from celery_app import process_pending_videos
from fastapi.responses import StreamingResponse
from utils import send_email
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
app.include_router(admin.router)


VIDEO_DIRECTORY = "static/generated_videos"

@app.post("/play-video/")
async def get_video(video_name: str = Form(...)):
    video_path = os.path.join(VIDEO_DIRECTORY, video_name)
    print(video_name)
    print(video_path)

    if not os.path.exists(video_path):
        raise HTTPException(status_code=404, detail="Video not found")

    # Open the file in binary read mode
    def iterfile():
        with open(video_path, mode="rb") as file:
            yield from file  # Stream file data in binary

    return StreamingResponse(iterfile(), media_type="application/octet-stream", headers={"Content-Disposition": f"attachment; filename={video_name}"})





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
        <p>Hallo!</p> 
        <p>Geniet van je cadeauvideo!</p>
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
    # Establish database connection
    connection = get_db_connection()
    cursor = connection.cursor(dictionary=True)

    # Query to fetch the pending video
    query = """
        SELECT fv.id, fv.purchase_id, fv.final_video_path, fv.send_status, vp.send_date
        FROM final_videos fv
        JOIN video_purchases vp ON fv.purchase_id = vp.id
        WHERE fv.send_status = 'pending'
        ORDER BY fv.id ASC 
        LIMIT 1;
    """

    # Execute the query and fetch the first pending video
    cursor.execute(query)
    pending_video = cursor.fetchone()

    if pending_video:
        send_date = pending_video['send_date']
        current_time = datetime.now()

        print('send_date = ',send_date)
        print('current_time = ',current_time)

        # Define the time range for the send hour slot
        start_of_hour = send_date.replace(minute=0, second=0, microsecond=0)
        end_of_hour = start_of_hour + timedelta(hours=1)

        print('start_of_hour = ',start_of_hour)
        print('end_of_hour = ',end_of_hour)
        # Check if the current time falls within the send hour slot
        if start_of_hour <= current_time < end_of_hour:
            print(f"Processing video: {pending_video['final_video_path']}")

            # Fetch receiver's contact details
            purchase_query = """
                SELECT receiver_phone, receiver_email, user_email  
                FROM video_purchases 
                WHERE id = %s;
            """
            cursor.execute(purchase_query, (pending_video['purchase_id'],))
            purchase = cursor.fetchone()

            if purchase:
                # Clean and split phone numbers and email addresses
                phone_numbers = (
                    purchase['receiver_phone'].split(',')
                    if purchase['receiver_phone'] and purchase['receiver_phone'] != 'null'
                    else []
                )
                email_addresses = (
                    eval(purchase['receiver_email'])  # Convert stringified list to actual list
                    if purchase['receiver_email'] and purchase['receiver_email'] != 'null'
                    else []
                )

                # Send video via email to multiple recipients
                email_sent = False
                for email in email_addresses:
                    video_name = f"{os.path.basename(pending_video['final_video_path'])}"
                    react_video_page_url = f"http://134.122.63.191:3000/playvideo?url={video_name}"

                    subject = "Uw Definitieve Video"
                    subject1 = "Bevestiging: Uw Video Is Verzonden"
                    body = f"""
                    <html>
                    <head></head>
                    <body>
                        <p>Beste gebruiker,</p>
                        <p>Uw definitieve video is nu beschikbaar. Klik op de onderstaande link om de video te bekijken.</p>
                        <p>
                            <a href="{react_video_page_url}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-align: center; text-decoration: none; display: inline-block; border-radius: 5px;">
                                Bekijk de video
                            </a>
                        </p>
                        <p>Met vriendelijke groet,<br>Het Video Team</p>
                    </body>
                    </html>
                    """
                    body1 = f"""
                    <html>
                    <head></head>
                    <body>
                        <p>Beste {purchase['user_email']},</p>
                        <p>Wij zijn verheugd u te informeren dat uw video met de titel "<strong>Greet Video</strong>" succesvol is verzonden naar de beoogde ontvanger(s).</p>
                        <p>Als u verdere vragen heeft, kunt u altijd contact met ons opnemen.</p>
                        <p>Met vriendelijke groet,<br>Het Video Team</p>
                    </body>
                    </html>
                    """

                    send_email(email, subject, body)
                    send_email(purchase['user_email'], subject1, body1)
                    # if send_on_email(email.strip(), pending_video['final_video_path']):
                    email_sent = True
                    #     print(f"Video ID {pending_video['id']} sent via email to {email.strip()}.")

                # Mark the video as sent if email was successfully delivered to any recipient
                if email_sent:
                    mark_as_sent(cursor, connection, pending_video['id'])

                # Optional: Send video via WhatsApp (commented)
                # for phone in phone_numbers:
                #     if send_on_whatsapp(phone.strip(), os.path.basename(pending_video['final_video_path'])):
                #         mark_as_sent(cursor, connection, pending_video['id'])
                #         print(f"Video ID {pending_video['id']} sent via phone to {phone.strip()}.")
                #         break  # Stop after the first successful WhatsApp send

            else:
                print("No purchase information found for the pending video.")
        else:
            print("Current time does not match the send date hour. Skipping this video.")
    else:
        print("No pending videos to process.")

    # Close the database connection
    cursor.close()
    connection.close()




def mark_as_sent(cursor, connection, video_id):
    """Mark the video as sent in the database."""
    update_query = """
        UPDATE final_videos 
        SET send_status = 'sent' 
        WHERE id = %s;
    """
    cursor.execute(update_query, (video_id,))
    connection.commit()





# def dummy():
    # process_pending_videos.delay()
scheduler.add_job(load_pending_video, 'interval', seconds=3600)
# scheduler.add_job(dummy, 'interval', seconds=10)

scheduler.start()

# def shutdown_event():
#     """Shutdown the scheduler when the app stops."""
#     scheduler.shutdown()

# shutdown_event()
