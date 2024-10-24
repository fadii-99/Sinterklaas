from dotenv import load_dotenv
import os
from datetime import datetime
import requests
import asyncio
from routers.purchases import task_status


load_dotenv()
task_status = {}

XI_API_KEY = os.environ.get('XI_API_KEY')
VOICE_ID = os.environ.get('VOICE_ID')
CHUNK_SIZE = os.environ.get('CHUNK_SIZE')


def generate_voice(text: str, task_id: str, ts):
    task_status = ts
    print('\nGenerating voice\n')
    try:
        TEXT_TO_SPEAK = text
        OUTPUT_DIR = "static/generated_audios"
        
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file_path = os.path.join(OUTPUT_DIR, f"{task_id}.mp3")
        
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
            with open(output_file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    f.write(chunk)
            print("Audio stream saved successfully.")
            
            task_status[task_id] = "Completed"
            return output_file_path, task_status
        else:
            print(response.text)
            task_status[task_id] = f"Failed: {response.text}"
            return None
    except Exception as e:
        print(f"Error generating voice: {e}")
        task_status[task_id] = f"Failed: {e}"
        return None

def start_background_task():
    asyncio.run(generate_voice())
    
