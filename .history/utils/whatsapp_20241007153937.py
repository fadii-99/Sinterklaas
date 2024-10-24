from twilio.rest import Client
import requests
import os


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