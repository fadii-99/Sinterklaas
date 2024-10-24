from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import os
import requests
from datetime import datetime
from schemas import VideoPurchaseSchema
from routers.payments import create_payment
from dotenv import load_dotenv

load_dotenv()


router = APIRouter()

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchaseSchema, db: Session = Depends(get_db)):
    try:
        # Insert the data into the video_purchases table
        cursor = db.cursor()
        insert_query = """
            INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            purchase.user_email,
            purchase.receiver_phone,
            purchase.send_date,
            purchase.video_name,
            'pending' 
        ))
        db.commit()
        cursor.close()
        ret = create_payment(purchase.amount, purchase.video_name)

        return ret
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
    




XI_API_KEY = os.environ.get('XI_API_KEY')
VOICE_ID = os.environ.get('VOICE_ID')
CHUNK_SIZE = os.environ.get('CHUNK_SIZE')

def generate_voice(text: str):
    print('\nGenerating voice\n')
    try:
        TEXT_TO_SPEAK = text
        OUTPUT_PATH = "static/generated_audios"

        os.makedirs(OUTPUT_PATH, exist_ok=True)
        
        tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"
        
        headers = {
            "Accept": "application/json",
            "xi-api-key": XI_API_KEY
        }
        
        data = {
            "text": TEXT_TO_SPEAK,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {
                "stability": 0.5,
                "similarity_boost": 0.8,
                "style": 0.0,
                "use_speaker_boost": True
            }
        }
        
        response = requests.post(tts_url, headers=headers, json=data, stream=True)
        
        if response.ok:
            with open(OUTPUT_PATH, "wb") as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    f.write(chunk)
            print("Audio stream saved successfully.")
            return OUTPUT_PATH
        else:
            print(response.text)
            raise HTTPException(status_code=500, detail=f"Error generating voice: {response.text}")
    except Exception as e:
        print(f"Error generating voice: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating voice: {e}")
