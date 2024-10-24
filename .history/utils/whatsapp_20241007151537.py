from twilio.rest import Client

# Your Twilio Account SID and Auth Token
ACCOUNT_SID = 'ACfad9e57380aeac399e1f75b7a8622983'
AUTH_TOKEN = '0e30b63404b1d238611b99e0b91f8225'  # Replace with your actual Auth Token

# Twilio WhatsApp number
TWILIO_WHATSAPP_NUMBER = 'whatsapp:+3197010259010'

def send_whatsapp_video(receiver_phone: str, video_url: str):
    try:
        # Create a client to connect to Twilio
        client = Client(ACCOUNT_SID, AUTH_TOKEN)
        
        # Send a WhatsApp video message
        message = client.messages.create(
            from_=TWILIO_WHATSAPP_NUMBER,
            body='Here is your video!',
            media_url=[video_url],
            to=f'whatsapp:{receiver_phone}'
        )

        return {"status": "success", "message_sid": message.sid}

    except Exception as e:
        return {"status": "failed", "error": str(e)}