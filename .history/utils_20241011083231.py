import os
import smtplib
import requests
import random
from moviepy.editor import *
from PIL import Image



def send_email(to_email: str, subject: str, body: str):
    try:
        server = smtplib.SMTP('smtp.your-email-provider.com', 587)
        server.starttls()
        server.login('your-email@example.com', 'your-password')
        message = f'Subject: {subject}\n\n{body}'
        server.sendmail('your-email@example.com', to_email, message)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

def start_background_task(to_email: str, subject: str, body: str):
    print("Background task started for sending email")
    send_email(to_email, subject, body)

def update_purchase_status_to_in_progress(db, purchase_id: int):
    query = """
        UPDATE video_purchases 
        SET video_status = 'in-progress'
        WHERE id = %s AND video_status = 'pending'
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,))
    db.commit()
    cursor.close()

def get_pending_video(db):
    query = """
        SELECT id, voice_path
        FROM video_purchases 
        WHERE video_status = 'pending'
        LIMIT 1
    """
    cursor = db.cursor()
    cursor.execute(query)
    pending_purchase = cursor.fetchone()
    cursor.close()
    return pending_purchase


def get_files_for_video(db, purchase_id: int):
    query = """
        SELECT file_type, file_path 
        FROM video_files 
        WHERE purchase_id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,))
    files = cursor.fetchall()
    cursor.close()
    return files


def save_final_video(db, purchase_id: int, final_video_path: str, receiver_phone: str, send_date: str):
    query = """
        INSERT INTO final_videos (purchase_id, final_video_path, receiver_phone, send_date)
        VALUES (%s, %s, %s, %s)
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id, final_video_path, receiver_phone, send_date))
    db.commit()
    cursor.close()


def update_video_status(db, purchase_id: int, status: str):
    query = """
        UPDATE video_purchases 
        SET video_status = %s 
        WHERE id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (status, purchase_id))
    db.commit()
    cursor.close()


def generate_video(purchase_id, files, output_directory, db):
    query = """
        SELECT receiver_phone, send_date
        FROM video_purchases 
        WHERE id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,)) 
    pending_purchase = cursor.fetchone()
    cursor.close()

    print(f"Generating video with {len(files)} files...")
    return os.path.join(output_directory, "final_video.mp4")




WHATSAPP_TOKEN = os.getenv('WHATSAPP_ACCESS_TOKEN')
WHATSAPP_PHONE_NUMBER =os.getenv('WHATSAPP_PHONE_NUMBER')
PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID')


def send_whatsapp_video(receiver_phone: str, video_path: str):
    try:
        video_upload_url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/media"
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}"
        }
        files = {
            "file": (os.path.basename(video_path), open(video_path, 'rb'), 'video/mp4')
        }
        params = {
            "messaging_product": "whatsapp"
        }
        
        upload_response = requests.post(video_upload_url, headers=headers, files=files, params=params)
        upload_data = upload_response.json()
        
        if upload_response.status_code != 200:
            return {"status": "failed", "error": upload_data.get('error', {}).get('message')}

        media_id = upload_data['id']
        
        message_url = f"https://graph.facebook.com/v17.0/{PHONE_NUMBER_ID}/messages"
        message_data = {
            "messaging_product": "whatsapp",
            "to": receiver_phone,
            "type": "video",
            "video": {
                "id": media_id,
                "caption": "Here is your video!"
            }
        }

        message_response = requests.post(message_url, headers=headers, json=message_data)
        message_response_data = message_response.json()

        if message_response.status_code == 200:
            return {"status": "success", "message_id": message_response_data.get('messages')[0].get('id')}
        else:
            return {"status": "failed", "error": message_response_data.get('error', {}).get('message')}

    except Exception as e:
        return {"status": "failed", "error": str(e)}