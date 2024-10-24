from fastapi import APIRouter, Depends, HTTPException, FileResponse
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
        OUTPUT_DIR = "static/generated_audios"
        
        # Ensure the output directory exists
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        # Use current date and time to generate a unique filename
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file_path = os.path.join(OUTPUT_DIR, f"output_audio_{timestamp}.mp3")
        
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
            # Write audio content to file
            with open(output_file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    f.write(chunk)
            print("Audio stream saved successfully.")
            return output_file_path
        else:
            print(response.text)
            raise HTTPException(status_code=500, detail=f"Error generating voice: {response.text}")
    except Exception as e:
        print(f"Error generating voice: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating voice: {e}")

# FastAPI route to generate, send, and delete the file
@router.post("/generate-voice/")
async def generate_voice_endpoint(text: str):
    try:
        # Generate the voice and get the file path
        file_path = generate_voice(text)

        # Send the file to the client
        response = FileResponse(file_path, media_type='audio/mpeg')
        response.headers["Content-Disposition"] = f"attachment; filename={os.path.basename(file_path)}"

        # Delete the file after sending the response
        @response.call_on_close
        def cleanup():
            try:
                os.remove(file_path)
                print(f"File {file_path} deleted successfully.")
            except Exception as e:
                print(f"Error deleting file {file_path}: {e}")

        return response

    except HTTPException as he:
        raise he
    except Exception as e:
        print(f"Error in generate_voice_endpoint: {e}")
        raise HTTPException(status_code=500, detail=f"Error generating and sending voice: {e}")
