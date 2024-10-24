from dotenv import load_dotenv
import os
from datetime import datetime
import requests
from celery_app import celery_app
load_dotenv()



XI_API_KEY = os.environ.get('XI_API_KEY')
VOICE_ID = os.environ.get('VOICE_ID')
CHUNK_SIZE = os.environ.get('CHUNK_SIZE')


# @celery_app.task
# def generate_voice(text: str):
#     print('\nGenerating voice\n')
#     try:
#         TEXT_TO_SPEAK = text
#         OUTPUT_DIR = "static/generated_audios"
        
#         os.makedirs(OUTPUT_DIR, exist_ok=True)

#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#         output_file_path = os.path.join(OUTPUT_DIR, f"output_audio_{timestamp}.mp3")
        
#         tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"
        
#         headers = {
#             "Accept": "application/json",
#             "xi-api-key": XI_API_KEY
#         }
        
#         data = {
#             "text": TEXT_TO_SPEAK,
#             "model_id": "eleven_multilingual_v2",
#             "voice_settings": {
#                 "stability": 0.5,
#                 "similarity_boost": 0.8,
#                 "style": 0.0,
#                 "use_speaker_boost": True
#             }
#         }
        
#         response = requests.post(tts_url, headers=headers, json=data, stream=True)
        
#         if response.ok:
#             with open(output_file_path, "wb") as f:
#                 for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
#                     f.write(chunk)
#             print("Audio stream saved successfully.")
#             return output_file_path
#         else:
#             print(response.text)
#             return {'status_code':500, 'detail':f"Error generating voice: {response.text}"}
#     except Exception as e:
#         print(f"Error generating voice: {e}")
#         return {'status_code':500, 'detail':f"Error generating voice: {e}"}
    

generated_files = {}

def generate_voice_task(text: str, task_id: str):
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
            
            # Update the task status and file path
            generated_files[task_id] = {"status": "completed", "file_path": output_file_path}
            print(f"Audio stream saved successfully for task {task_id}.")
        else:
            generated_files[task_id] = {"status": "failed", "error": response.text}
            print(response.text)
    except Exception as e:
        generated_files[task_id] = {"status": "failed", "error": str(e)}
        print(f"Error generating voice for task {task_id}: {e}")
