import os
import smtplib
import requests
import random
from moviepy.editor import *
from PIL import Image



class MediaProcessor:
    def __init__(self, image_paths, video_paths):
        self.image_paths = image_paths
        self.video_paths = video_paths
        self.media_paths = image_paths + video_paths
        random.shuffle(self.media_paths)

        self.max_width, self.max_height = self.find_max_dimensions()

    def find_max_dimensions(self):
        max_width, max_height = 0, 0
        
        for img_path in self.image_paths:
            img = Image.open(img_path)
            width, height = img.size
            max_width = max(max_width, width)
            max_height = max(max_height, height)
        
        for video_path in self.video_paths:
            video = VideoFileClip(video_path)
            max_width = max(max_width, video.w)
            max_height = max(max_height, video.h)
        
        return max_width, max_height

    def create_padded_image_clip(self, img_path):
        img = Image.open(img_path)
        width, height = img.size
        duration = random.randint(3, 5)
        img_clip = ImageClip(img_path).set_duration(duration)
        img_clip = img_clip.margin(
            left=(self.max_width - width) // 2, 
            right=(self.max_width - width) // 2,
            top=(self.max_height - height) // 2, 
            bottom=(self.max_height - height) // 2, 
            color=(0, 0, 0)
        )
        img_clip = img_clip.fx(vfx.resize, lambda t: 1 + 0.02 * t)
        
        return img_clip

    def create_padded_video_clip(self, video_path):
        video_clip = VideoFileClip(video_path)
        width, height = video_clip.size
        video_clip = video_clip.margin(
            left=(self.max_width - width) // 2, 
            right=(self.max_width - width) // 2,
            top=(self.max_height - height) // 2, 
            bottom=(self.max_height - height) // 2, 
            color=(0, 0, 0)
        )
        video_clip = video_clip.fx(vfx.resize, lambda t: 1 + 0.02 * t)
        
        return video_clip

    def process_media(self):
        final_clips = []
        for media_path in self.media_paths:
            if media_path.endswith((".jpg", ".jpeg", ".png")):
                final_clips.append(self.create_padded_image_clip(media_path))
            elif media_path.endswith(".mp4"):
                final_clips.append(self.create_padded_video_clip(media_path))

        final_clip = concatenate_videoclips(final_clips, method="compose")
        return final_clip

    def save_final_video(self, output_path, fps=24):
        final_clip = self.process_media()
        final_clip.write_videofile(output_path, fps=fps)



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



def generate_video(purchase_id: int, files, final_video_dir: str, db):
    image_paths = []
    video_paths = []
    
    for file in files:
        if file['file_type'] == 'image':
            image_paths.append(file['file_path'])
        elif file['file_type'] == 'video':
            video_paths.append(file['file_path'])
    
    if not os.path.exists(final_video_dir):
        os.makedirs(final_video_dir)
    
    final_video_name = f"final_output_{purchase_id}.mp4"
    final_video_path = os.path.join(final_video_dir, final_video_name)
    
    media_processor = MediaProcessor(image_paths, video_paths)
    
    media_processor.save_final_video(final_video_path)
    
    cursor = db.cursor()
    insert_query = """
        INSERT INTO final_videos (purchase_id, final_video_path, send_status)
        VALUES (%s, %s, 'pending')
        ON DUPLICATE KEY UPDATE
            final_video_path = VALUES(final_video_path),
            send_status = 'complete'
    """
    cursor.execute(insert_query, (purchase_id, final_video_path))
    db.commit()
    cursor.close()

    
    return final_video_path

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