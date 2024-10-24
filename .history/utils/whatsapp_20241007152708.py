from twilio.rest import Client
import requests
import os

# Your Twilio Account SID and Auth Token

WHATSAPP_TOKEN = 'EAAXZBH2deTokBO3fKhVJSZBe0IAyj9FYX3kBUWUqeuaYgXckvhYneKJZBIbDXZCqQ7atuSUCw0YTfqoaUrEM4KZAD6JIHTiZAvNkxce3fAGABHvKhg0GQc8wZAfccKfRcZC1d8Ir0pCXEJfdivENe6O6r5ZC3Oy3pKrqDZAoNJTqBmTbfCPxEtXJncunQ8H0O4eIN2tZBv65J9N0Dm4EXUVUxG0jKOhCfuucPY19EUZD'
PHONE_NUMBER_ID = 'ACfad9e57380aeac399e1f75b7a8622983'
WHATSAPP_PHONE_NUMBER = '3197010259010'


def send_whatsapp_video(receiver_phone: str, video_path: str):
    try:
        # Step 1: Upload the video to WhatsApp servers
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
        
        # Step 2: Send the video to the recipient
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