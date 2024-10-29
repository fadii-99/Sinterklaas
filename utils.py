import os
import cv2
import smtplib
import requests
import random
from moviepy.editor import *
from PIL import Image, ImageDraw, ImageFont
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import asyncio
from datetime import datetime
import numpy as np
from moviepy.config import change_settings
change_settings({"IMAGEMAGICK_BINARY": "/usr/bin/convert"})



class MediaProcessor:
    def __init__(self, image_paths, video_paths, pip_position=(500, 300), end_image_path="end_image.png"):
        self.image_paths = image_paths
        self.video_paths = video_paths
        self.pip_position = pip_position
        self.end_image_path = end_image_path  # PNG for the ending clip
        random.shuffle(self.image_paths)

    def create_main_clip(self):
        """Create the main background clip."""
        if self.video_paths:
            main_clip = VideoFileClip(self.video_paths[0])
        else:
            main_clip = ImageClip(self.image_paths[0]).set_duration(10).set_fps(24)
        return main_clip

    # def create_pip_clip(self):
    #     # if self.image_paths:
    #     print('pip k ander')
    #     img = Image.open(self.image_paths[0]).convert("RGBA").rotate(-14, expand=True)

    #     datas = img.getdata()
    #     new_data = [
    #         (255, 255, 255, 0) if item[:3] == (255, 255, 255) else item
    #         for item in datas
    #     ]
    #     img.putdata(new_data)

    #     print('putdata')
    #     rotated_image_path = "rotated_image.png"
    #     img.save(rotated_image_path, "PNG")
    #     print('ImageClip')

    #     pip_clip = ImageClip(rotated_image_path, transparent=True).set_duration(11.05).set_fps(24)
    #     print('pip_clip')
    #     import cv2
    #     pip_clip = pip_clip.resize(width=650, height=650)
    #     print('ended')
    #     # else:
    #     #     pip_clip = VideoFileClip(self.video_paths[0]).subclip(0, 6)

    #     pip_clip = pip_clip.set_position(self.pip_position).set_start(24.56)
    #     return pip_clip

    def create_pip_clip(self):
        """Create the Picture-in-Picture (PIP) clip using OpenCV for resizing."""
        if self.image_paths:
            try:
                # Load the image using OpenCV
                img = cv2.imread(self.image_paths[0], cv2.IMREAD_UNCHANGED)

                # Check if the image was loaded successfully
                if img is None:
                    raise FileNotFoundError(f"Image not found: {self.image_paths[0]}")

                # Resize the image using OpenCV
                resized_img = cv2.resize(img, (650, 650))

                # Convert the resized image (OpenCV format) to a PIL Image
                resized_img_pil = Image.fromarray(cv2.cvtColor(resized_img, cv2.COLOR_BGR2RGBA))

                # Save the resized image to use with ImageClip
                resized_image_path = "resized_image.png"
                resized_img_pil.save(resized_image_path, "PNG")

                # Create the PIP clip with the resized image
                pip_clip = ImageClip(resized_image_path, transparent=True).set_duration(11.05).set_fps(24)

            except Exception as e:
                print(f"Error in create_pip_clip: {e}")
                raise
        else:
            pip_clip = VideoFileClip(self.video_paths[0]).subclip(0, 6)

        pip_clip = pip_clip.set_position(self.pip_position).set_start(24.56)
        return pip_clip

    def process_pip_video(self):
        """Combine the main clip and PIP clip."""
        print('create_main_clip')
        main_clip = self.create_main_clip()
        print('create_pip_clip')
        pip_clip = self.create_pip_clip()
        print('CompositeVideoClip')
        final_clip = CompositeVideoClip([main_clip, pip_clip])
        print('all done')
        return final_clip

    def concatenate_final_video(self, final_clip, fv2_path, audio_duration):
        """Concatenate `fv2.mp4` to match the total length with the audio."""
        fv2_clip = VideoFileClip(fv2_path)

        remaining_duration = audio_duration - final_clip.duration
        if remaining_duration > 0:
            start_time = max(0, fv2_clip.duration - remaining_duration)
    
            # Extract the clip from the calculated start time to the end
            fv2_clip_trimmed = fv2_clip.subclip(start_time, fv2_clip.duration)
            
            # Concatenate the final clip with the trimmed fv2 clip
            final_video = concatenate_videoclips([final_clip, fv2_clip_trimmed])
        else:
            final_video = final_clip

        # Add fade-out to the final video
        final_video = final_video.fx(vfx.fadeout, 1)

        # Add the ending clip with transitions
        end_clip = ImageClip("static/end_image.png").set_duration(2)

        # Concatenate the final video with the end clip
        final_video_with_end = concatenate_videoclips([final_video, end_clip])

        return final_video_with_end

    def verify_audio_path(self, audio_path):
        print(f"Verifying audio path: {audio_path}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"File exists: {os.path.exists(audio_path)}")

    def save_final_video(self, output_path, audio_path, fv2_path, fps=24):
        """Save the final video with the correct duration and audio."""
        self.verify_audio_path(audio_path)

        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio file not found: {audio_path}")

        audio_clip = AudioFileClip(audio_path)
        audio_duration = audio_clip.duration

        print('going to video')

        final_clip = self.process_pip_video()
        print('started')

        final_video = self.concatenate_final_video(final_clip, fv2_path, audio_duration)

        print('final')
        # Set the audio for the final video
        final_video = final_video.set_audio(audio_clip)
        print('saving')

        # Write the final video to the output file
        final_video.write_videofile(output_path, fps=fps)

# Example usage
# processor = MediaProcessor(
#     image_paths=["image1.png"],
#     video_paths=["fv1.mp4"]
# )
# processor.save_final_video(
#     output_path="output_video.mp4",
#     audio_path="generated_audio.mp3",
#     fv2_path="fv2.mp4"
# )
# place image in book

# class MediaProcessor:
#     def __init__(self, image_paths, video_paths, pip_position=(500, 300)):
#         print(video_paths)
#         self.image_paths = image_paths
#         self.video_paths = video_paths
#         self.media_paths = image_paths + video_paths
#         self.pip_position = pip_position  # Custom PIP position
#         random.shuffle(self.media_paths)  # Optional shuffle


#     def create_main_clip(self):
#         """Create the main background clip."""
#         if self.video_paths:
#             main_clip = VideoFileClip(self.video_paths[0])  # Use original video duration
#         else:
#             main_clip = ImageClip(self.image_paths[0]).set_duration(10).set_fps(24)
#         return main_clip

#     def create_pip_clip(self):
#         """Create the Picture-in-Picture (PIP) clip with rotation and transparency."""
#         if self.image_paths:
#             # Open the image, convert to RGBA (supports transparency), and rotate it
#             img = Image.open(self.image_paths[0]).convert("RGBA").rotate(-14, expand=True)

#             # Make the white background transparent
#             datas = img.getdata()
#             new_data = []
#             for item in datas:
#                 # Replace white (or near-white) with transparency
#                 if item[:3] == (255, 255, 255):  # White pixels
#                     new_data.append((255, 255, 255, 0))  # Fully transparent
#                 else:
#                     new_data.append(item)  # Keep original

#             img.putdata(new_data)

#             # Save the processed image
#             rotated_image_path = "rotated_image.png"
#             img.save(rotated_image_path, "PNG")  # Save as PNG to preserve transparency

#             # Create the PIP clip from the transparent image
#             pip_clip = ImageClip(rotated_image_path, transparent=True).set_duration(11.2).set_fps(24)

#             pip_clip = pip_clip.resize(width=650, height=650)
#         else:
#             pip_clip = VideoFileClip(self.video_paths[0]).subclip(0, 6)  

#         # Position the PIP clip and start it at 20 seconds
#         pip_clip = pip_clip.set_position(self.pip_position).set_start(17.65)
#         return pip_clip

#     def create_text_image(self, text, output_path="text_image.png"):
#         """Create an image with large text using PIL."""
#         # Create a blank transparent image (RGBA)
#         img = Image.new('RGBA', (700, 200), (255, 182, 193)).rotate(-15, expand=True)  # Transparent canvas
#         d = ImageDraw.Draw(img)

#         # Load a TTF font with large size
#         font_path = "Kids Magazine.ttf"
#         try:
#             font = ImageFont.truetype(font_path, 60)  # Font size set to 100
#         except IOError:
#             font = ImageFont.load_default()  # Fallback if font not found

#         # Get the bounding box of the text
#         bbox = d.textbbox((0, 0), text, font=font)
#         text_width = bbox[2] - bbox[0]
#         text_height = bbox[3] - bbox[1]

#         # Center the text on the canvas
#         x = (img.width - text_width) // 2
#         y = (img.height - text_height) // 2

#         # Draw the text in black
#         d.text((x, y), text, font=font,fill=(35, 34, 34))

#         # Save the image to a file
#         img.save(output_path, "PNG")  # Save as PNG to preserve transparency
#         return output_path

#     def create_text_clip(self):
#         """Create a text image clip positioned above the PIP clip."""
#         text_image_path = self.create_text_image("Fawad")
#         text_clip = ImageClip(text_image_path).set_duration(6).set_fps(24)

#         # Position the text 150 pixels above the PIP clip and start at 20 seconds
#         text_x, text_y = self.pip_position
#         text_clip = text_clip.set_position((text_x, text_y - 200)).set_start(20)

#         return text_clip

#     def process_pip_video(self):
#         """Combine the main clip, PIP clip, and text clip."""
#         main_clip = self.create_main_clip()
#         video_duration = main_clip.duration

#         # Ensure the video is at least 26 seconds long to place the PIP at 20 seconds
#         if video_duration < 26:
#             raise ValueError("The video must be at least 26 seconds long to place the PIP at 20 seconds.")

#         pip_clip = self.create_pip_clip()
#         # text_clip = self.create_text_clip()

#         # Overlay the PIP and text clip on top of the main clip
#         final_clip = CompositeVideoClip([main_clip, pip_clip])
#         # final_clip = CompositeVideoClip([main_clip, pip_clip, text_clip])

#         return final_clip

#     def save_final_video(self, output_path, audio_path=None, fps=24):
#         """Save the final video with PIP effect and text."""
#         final_clip = self.process_pip_video()
#         if audio_path:
#             audio_clip = AudioFileClip(audio_path)
#             final_clip = final_clip.set_audio(audio_clip)

#         final_clip.write_videofile(output_path, fps=fps)





def start_background_task(to_email: str, subject: str, body: str):
    print("Background task started for sending email")
    send_email(to_email, subject, body)

def update_purchase_status_to_in_progress(connection, purchase_id: int):
    """Update purchase status to 'in-progress'."""
    query = """
        UPDATE video_purchases 
        SET video_status = 'in-progress'
        WHERE id = %s AND video_status = 'pending'
    """
    cursor = connection.cursor()
    cursor.execute(query, (purchase_id,))
    connection.commit()
    cursor.close()


def get_pending_video(connection):
    """Retrieve the first pending video purchase."""
    print("Retrieving pending video.")
    
    # Ensure the cursor is a dictionary cursor
    cursor = connection.cursor(dictionary=True)

    try:
        query = """
            SELECT * FROM video_purchases WHERE video_status = 'pending' LIMIT 1
        """
        cursor.execute(query)
        pending_purchase = cursor.fetchone()  # Fetch the first pending purchase

        if pending_purchase is None:
            return None  # No pending purchase found

        # Log what we retrieved to debug
        print(f"Pending purchase: {pending_purchase}")
        return pending_purchase  # This will be a dictionary

    finally:
        cursor.close()  # Ensure the cursor is properly closed



def get_files_for_video(connection, purchase_id: int):
    """Retrieve files associated with a video purchase."""
    query = """
        SELECT file_type, file_path 
        FROM video_files 
        WHERE purchase_id = %s
    """
    cursor = connection.cursor()
    cursor.execute(query, (purchase_id,))
    files = cursor.fetchall()
    cursor.close()
    print(files)
    return files


def update_video_status(connection, purchase_id: int, status: str):
    """Update the video status."""
    query = """
        UPDATE video_purchases 
        SET video_status = %s 
        WHERE id = %s
    """
    cursor = connection.cursor()
    cursor.execute(query, (status, purchase_id))
    connection.commit()
    cursor.close()


def generate_video(purchase_id, purchase_date, purchase_email, files, final_video_dir, connection, generated_audio):
    print("\n\nGenerating video")

    # Debug print to inspect the structure of `files`
    print(f"Files received: {files} (type: {type(files)})")

    # Ensure each file is a tuple (file_type, file_path)
    for file in files:
        print(f"File: {file} (type: {type(file)})")

    # Extract paths from the tuples (file_type, file_path)
    image_paths = [file_path for file_type, file_path in files if file_type == 'image']

    # Create the output directory if it doesn't exist
    if not os.path.exists(final_video_dir):
        os.makedirs(final_video_dir)

    # Define the final video path
    final_video_name = f"{purchase_email}_{purchase_date}.mp4"
    final_video_path = os.path.join(final_video_dir, final_video_name)

    # place image sepeartely
    # media_processor = MediaProcessor(image_paths, video_paths)
    # media_processor.save_final_video(final_video_path, audio_path=generated_audio)

    # place image in a book
    pip_position = (520, 370)
    processor = MediaProcessor(image_paths=image_paths, video_paths=['static/fv1.mp4'], pip_position=pip_position, end_image_path='static/end_image.png')
    processor.save_final_video(final_video_path, audio_path=generated_audio, fv2_path="static/endingpart.mp4")

    # Insert or update the final video record in the database
    cursor = connection.cursor()
    insert_query = """
        INSERT INTO final_videos (purchase_id, final_video_path, send_status)
        VALUES (%s, %s, 'pending')
        ON DUPLICATE KEY UPDATE
            final_video_path = VALUES(final_video_path),
            send_status = 'complete'
    """
    cursor.execute(insert_query, (purchase_id, final_video_path))
    connection.commit()
    cursor.close()

    return final_video_path




XI_API_KEY = os.environ.get('XI_API_KEY')
VOICE_ID = os.environ.get('VOICE_ID')
CHUNK_SIZE = 1024


def generate_voice(pending_purchase, email, date, name, age, hobby, purchase_id, connection):
    print('\nGenerating voice in Dutch\n')
    try:
        friends_names = pending_purchase['friends_names']
        family_names = pending_purchase['family_names']
        school_name = pending_purchase['school_name']
        teacher_name = pending_purchase['teacher_name']
        favorite_subject = pending_purchase['favorite_subject']
        friends_names = pending_purchase['friends_names']
        family_names = pending_purchase['family_names']
       
        text = f"Ohhh, hallo daar! Wat fijn dat ik vandaag speciaal voor jou, {name}, een heel bijzonder bericht mag inspreken! Weet je, ik heb net in mijn grote boek gekeken, en wat heb ik daar veel over jou gelezen. Maar eerst wil ik je vertellen hoe blij ik ben dat het weer bijna Sinterklaasavond is! Wat een spannende tijd, hè? Met pepernoten, cadeautjes en veel gezelligheid.\n\nNou, {name}, ik heb gehoord dat je al {age} jaar oud bent! Wat word jij al groot zeg! En weet je wat ik ook weet? Jij houdt van {hobby}, klopt dat? Wat ontzettend leuk!\n\nIk ben super trots op jou, want je best doen is heel belangrijk, en jij doet dat fantastisch!\n\nOh, en wist je dat jouw vriendjes {friends_names} ook super blij met jou zijn? Jullie spelen altijd zo leuk samen, dat kan ik vanuit Spanje zelfs zien! Ja hoor, ik zie alles, met mijn verrekijker natuurlijk! En weet je wat? {family_names} zijn ook heel trots op jou. Jij bent zo lief en gezellig, dat maakt me elke keer weer blij als ik aan jou denk.\n\nNu, {name}, wil ik je ook nog eens bedanken voor het zetten van je schoen! De liedjes die jij zingt, hoor ik helemaal in Spanje, en wat zijn ze prachtig!\n\nLieve {name}, ik wens je alvast een hele fijne Sinterklaasavond. Geniet ervan, wees lief voor elkaar, en wie weet wat voor mooie cadeautjes er nog voor jou klaar liggen. Tot snel!"
        # text = (
        #     f"Ohhh, hallo daar! Wat fijn dat ik vandaag speciaal voor jou, {name}, een heel bijzonder bericht mag inspreken! "
        #     f"Weet je, ik heb net in mijn grote boek gekeken, en wat heb ik daar veel over jou gelezen. "
        #     f"Maar eerst wil ik je vertellen hoe blij ik ben dat het weer bijna Sinterklaasavond is! "
        #     f"Wat een spannende tijd, hè? Met pepernoten, cadeautjes en veel gezelligheid.\n\n"
        #     f"Nou, {name}, ik heb gehoord dat je al {age} jaar oud bent! Wat word jij al groot zeg! "
        #     f"En weet je wat ik ook weet? Jij houdt van {hobby}, klopt dat? Wat ontzettend leuk!\n\n"
        #     f"Ik ben super trots op jou, want je best doen is heel belangrijk, en jij doet dat fantastisch!\n\n"
        #     f"En hoe gaat het eigenlijk op school? Ik heb gehoord dat je op {school_name} zit, "
        #     f"daar ben ik echt trots op! Het is heel belangrijk om je best te doen op school en jij doet dat geweldig!\n\n"
        #     f"Oh, en wist je dat jouw vriendjes {friends_names} ook super blij met jou zijn? "
        #     f"Jullie spelen altijd zo leuk samen, dat kan ik vanuit Spanje zelfs zien! Ja hoor, ik zie alles, met mijn verrekijker natuurlijk! "
        #     f"En weet je wat? {family_names} zijn ook heel trots op jou. Jij bent zo lief en gezellig, dat maakt me elke keer weer blij als ik aan jou denk.\n\n"
        #     f"Nu, {name}, wil ik je ook nog eens bedanken voor het zetten van je schoen! "
        #     f"De liedjes die jij zingt, hoor ik helemaal in Spanje, en wat zijn ze prachtig!\n\n"
        #     f"Lieve {name}, ik wens je alvast een hele fijne Sinterklaasavond. Geniet ervan, wees lief voor elkaar, "
        #     f"en wie weet wat voor mooie cadeautjes er nog voor jou klaar liggen. Tot snel!"
        # )



        # final_message = text.format(
        # name=name,
        # age=age,
        # hobby=hobby,
        # school_name=school_name,
        # teacher_name=teacher_name,
        # favorite_subjec=favorite_subjec,
        # friends_names=friends_names,
        # family_names=family_names
        # )

        
        OUTPUT_DIR = "static/generated_audios"
        os.makedirs(OUTPUT_DIR, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        output_file_path = os.path.join(OUTPUT_DIR, f"{email}_{date}.mp3")

        tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"

        headers = {
            "Accept": "application/json",
            "xi-api-key": XI_API_KEY
        }

        data = {
            "text": text,
            "model_id": "eleven_multilingual_v2",  # Ensure the model supports multiple languages
            "voice_settings": {
                "stability": 0.6,# Increase stability slightly to reduce pauses
                "similarity_boost": 0.72, # Lower similarity boost to allow faster delivery
                "style": 0.68,# Increase style for smoother, more fluid speech
                "use_speaker_boost": True
            }
        }

        response = requests.post(tts_url, headers=headers, json=data, stream=True)

        if response.ok:
            with open(output_file_path, "wb") as f:
                for chunk in response.iter_content(chunk_size=CHUNK_SIZE):
                    f.write(chunk)
            print("Audio stream saved successfully.")

            query = """
                UPDATE video_purchases 
                SET voice_path = %s 
                WHERE id = %s
            """
            cursor = connection.cursor()
            cursor.execute(query, (output_file_path, purchase_id))
            connection.commit()
            cursor.close()

            return output_file_path
        else:
            print(f"Error in API response: {response.text}")
            return None

    except Exception as e:
        print(f"Error generating voice: {e}")
        return None


# def generate_voice( email, date, name, age, hobby,purchase_id, connection):
#     print('\nGenerating voice\n')
#     try:
#         text = f"Ohhh, hello there! How wonderful that I get to record a very special message just for you, {name}! You know, I’ve just looked into my big book, and I’ve read so much about you. But first, I want to tell you how happy I am that it’s almost Sinterklaas Eve! What an exciting time, right? With pepernoten, gifts, and so much fun! Well,<break time='1s'/> {name} I heard you’re already {age}, years old! You’re growing up so fast! And do you know what else I know? You love {hobby}, is that right? That’s so much fun!"
        
#         OUTPUT_DIR = "static/generated_audios"
#         os.makedirs(OUTPUT_DIR, exist_ok=True)

#         timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
#         output_file_path = os.path.join(OUTPUT_DIR, f"{email}_{date}.mp3")
        
#         tts_url = f"https://api.elevenlabs.io/v1/text-to-speech/{VOICE_ID}/stream"

#         headers = {
#             "Accept": "application/json",
#             "xi-api-key": XI_API_KEY
#         }

#         data = {
#             "text": text,
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

#             query = """
#                 UPDATE video_purchases 
#                 SET voice_path = %s 
#                 WHERE id = %s
#             """
#             cursor = connection.cursor()
#             cursor.execute(query, (output_file_path, purchase_id))
#             connection.commit()
#             cursor.close()
            
#             return output_file_path
#         else:
#             print(response.text)
#             return None
#     except Exception as e:
#         print(f"Error generating voice: {e}")
#         return None

# def start_background_task(text: str, task_id: str):
#     # Use `asyncio.run` to execute the async function from a synchronous context
#     asyncio.run(generate_voice(text, task_id))









def send_email(to_email: str, subject: str, body: str):
    try:
        email_host = os.getenv('EMAIL_HOST')
        email_port = int(os.getenv('EMAIL_PORT'))
        email_user = os.getenv('EMAIL_USER')
        email_pass = os.getenv('EMAIL_PASS')

        msg = MIMEMultipart('alternative')
        msg['From'] = email_user
        msg['To'] = to_email
        msg['Subject'] = subject

        msg.attach(MIMEText(body, 'html'))

        server = smtplib.SMTP(email_host, email_port)
        server.starttls()
        server.login(email_user, email_pass)
        server.sendmail(email_user, to_email, msg.as_string())
        server.quit()

        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False


WHATSAPP_TOKEN = os.getenv('WHATSAPP_ACCESS_TOKEN')
WHATSAPP_PHONE_NUMBER =os.getenv('WHATSAPP_PHONE_NUMBER')
PHONE_NUMBER_ID = os.getenv('PHONE_NUMBER_ID')


import os
import requests

# Load credentials from environment variables
WHATSAPP_TOKEN = os.getenv("WHATSAPP_ACCESS_TOKEN")
PHONE_NUMBER_ID = os.getenv("PHONE_NUMBER_ID")

def send_whatsapp_video(receiver_phone: str, video_path: str):
    try:
        # Step 1: Upload the video to WhatsApp
        video_upload_url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/media"
        headers = {
            "Authorization": f"Bearer {WHATSAPP_TOKEN}"
        }
        files = {
            "file": (os.path.basename(video_path), open(video_path, 'rb'), 'video/mp4')
        }
        params = {
            "messaging_product": "whatsapp"
        }

        print(f"Uploading video: {video_path}...")
        upload_response = requests.post(video_upload_url, headers=headers, files=files, params=params)

        # Ensure the file is closed after the request
        files["file"][1].close()

        upload_data = upload_response.json()
        if upload_response.status_code != 200:
            print(f"Upload failed: {upload_data}")
            return {
                "status": "failed",
                "error": upload_data.get('error', {}).get('message', 'Unknown error')
            }

        media_id = upload_data['id']
        print(f"Video uploaded successfully. Media ID: {media_id}")

        # Step 2: Send the uploaded video via WhatsApp
        message_url = f"https://graph.facebook.com/v20.0/{PHONE_NUMBER_ID}/messages"
        message_data = {
            "messaging_product": "whatsapp",
            "to": receiver_phone,
            "type": "video",
            "video": {
                "id": media_id,
                "caption": "Here is your video!"
            }
        }

        print(f"Sending video to: {receiver_phone}...")
        message_response = requests.post(message_url, headers=headers, json=message_data)
        message_response_data = message_response.json()

        if message_response.status_code == 200:
            message_id = message_response_data.get('messages', [{}])[0].get('id', 'N/A')
            print(f"Message sent successfully. Message ID: {message_id}")
            return {"status": "success", "message_id": message_id}
        else:
            error_message = message_response_data.get('error', {}).get('message', 'Unknown error')
            print(f"Message sending failed: {error_message}")
            return {
                "status": "failed",
                "error": error_message
            }

    except FileNotFoundError:
        print(f"Error: File not found at {video_path}")
        return {"status": "failed", "error": f"File not found at {video_path}"}

    except requests.exceptions.RequestException as e:
        print(f"Network error: {e}")
        return {"status": "failed", "error": f"Network error: {str(e)}"}

    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return {"status": "failed", "error": str(e)}



def send_email_with_video(to_email: str, subject: str, body: str, video_url: str):
    try:
        # Fetch email configuration from environment variables
        email_host = os.getenv('EMAIL_HOST')
        email_port = int(os.getenv('EMAIL_PORT', 587))
        email_user = os.getenv('EMAIL_USER')
        email_pass = os.getenv('EMAIL_PASS')

        # Download the video from the provided URL
        local_video_path = video_url

        # Create the email message
        msg = MIMEMultipart('alternative')
        msg['From'] = email_user
        msg['To'] = to_email
        msg['Subject'] = subject

        # Add email body
        msg.attach(MIMEText(body, 'plain'))

        # Attach the video file
        with open(local_video_path, 'rb') as f:
            video_attachment = MIMEApplication(f.read(), _subtype='mp4')
            video_attachment.add_header(
                'Content-Disposition', 
                f'attachment; filename="{os.path.basename(local_video_path)}"'
            )
            msg.attach(video_attachment)

        # Connect to the SMTP server and send the email
        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()  # Secure the connection
            server.login(email_user, email_pass)
            server.send_message(msg)

        print(f"Email sent successfully to {to_email}!")
        return {"status": "success", "message": f"Email sent successfully to {to_email}!"}

    except Exception as e:
        print(f"An error occurred: {e}")
        return {"status": "failed", "error": str(e)}
    




def send_receipt_email(email: str, payment_id: str, video_name: str, amount_value: str, currency: str):
    subject = "Your Payment Receipt - Sinterklaas"
    body = f"""
    <html>
    <body style="background-color: #ffffff; font-family: Arial, sans-serif; color: #333; margin: 0; padding: 20px;">
        <div style="max-width: 600px; margin: auto; border: 1px solid #c00; border-radius: 5px; overflow: hidden;">
            <div style="background-color: #c00; padding: 20px; color: #ffffff;">
                <h1 style="margin: 0;">SintMagie Payment Receipt</h1>
            </div>
            <div style="padding: 20px;">
                <p style="font-size: 16px;">Thank you for your payment!</p>
                <hr style="border: 1px solid #c00; margin: 20px 0;">
                <p style="font-size: 14px;"><strong>Payment ID:</strong> {payment_id}</p>
                <p style="font-size: 14px;"><strong>Video Name:</strong> {video_name}</p>
                <p style="font-size: 14px;"><strong>Amount:</strong> {amount_value} {currency}</p>
                <p style="font-size: 14px;">Your support means a lot!</p>
            </div>
            <div style="background-color: #f7f7f7; padding: 10px; text-align: center;">
                <p style="font-size: 12px; color: #888; margin: 0;">Wishing you a joyful SintMagie celebration!</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    # Assuming you have a function to send emails
    send_email(email, subject, body)