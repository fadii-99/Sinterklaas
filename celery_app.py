from celery import Celery
from database import get_db_connection  # Ensure this import is correct
import os

from utils import (
    update_video_status, get_pending_video, get_files_for_video,
    generate_video, update_purchase_status_to_in_progress, generate_voice
)
from database import get_db

celery_app = Celery(
    'sintmagie',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

celery_app.conf.update(
    broker_connection_retry_on_startup=True,
    worker_concurrency=5,
    task_acks_late=True,
    worker_prefetch_multiplier=1
)





@celery_app.task
def process_pending_videos():
    """Process pending video purchases."""
    connection = get_db_connection()  
    cursor = connection.cursor(dictionary=True)  # Use dictionary cursor

    try:

        # Retrieve a pending video purchase
        pending_purchase = get_pending_video(connection)

        if not pending_purchase:
            print("No pending videos found.")
            return  # Exit if no pending purchase found

        # Access values from the dictionary
        purchase_id = pending_purchase['id']
        purchase_date = pending_purchase['created_at']
        purchase_email = pending_purchase['user_email']
        name = pending_purchase['name']
        age = pending_purchase['age']
        hobby = pending_purchase['hobby']

        voice_path = pending_purchase['voice_path']
        print(f"Processing purchase ID: {purchase_id}")


        print("\nGenerating Voice\n")

        # generated_audio = generate_voice(pending_purchase, purchase_email, purchase_date, name, age, hobby,purchase_id,connection)
        # print(generated_audio)
        generated_audio = 'static/generated_audios/aqib@gmail.com_2024-10-27 10:44:04.mp3'
        if generated_audio == None:
            print("Failed to generate audio.")
            return False
        print("\nGenerating Voice Successfull\n")


        # Update the purchase status to 'in-progress'
        update_purchase_status_to_in_progress(connection, purchase_id)
        print("\nPending to in-progress\n")

        # Retrieve associated files
        files = get_files_for_video(connection, purchase_id)
        print(f"get_files_for_video: {files}")

        final_video_dir = "static/generated_videos"
        print(f"Generating video for purchase ID: {purchase_id}")

        # Generate the final video
        final_video_path = generate_video(purchase_id, purchase_date, purchase_email, files, final_video_dir, connection,generated_audio)
        print(f"Generating video statusD: {final_video_path}")

        # Update the video status to 'completed'
        update_video_status(connection, purchase_id, 'completed')

        connection.commit()
        print("All pending videos processed successfully.")

    except Exception as e:
        print(f"Error in process_pending_videos: {e}")
        connection.rollback()

    finally:
        cursor.close()
        connection.close()
 

# @celery_app.task
# def process_pending_videos():
#     """Process pending video purchases."""
#     connection = get_db_connection()  
#     cursor = connection.cursor(dictionary=True)  # Use dictionary cursor

#     try:
#         # Step 1: Retrieve a pending video purchase
#         pending_purchase = get_pending_video(connection)
#         if not pending_purchase:
#             print("No pending videos found.")
#             return

#         purchase_id = pending_purchase['id']
#         print(f"Processing purchase ID: {purchase_id}")

#         # Step 2: Generate voice
#         generated_audio = generate_voice(
#             pending_purchase['user_email'],
#             pending_purchase['created_at'],
#             pending_purchase['name'],
#             pending_purchase['age'],
#             pending_purchase['hobby'],
#             purchase_id,
#             connection
#         )
#         if generated_audio is None:
#             print("Failed to generate audio.")
#             return False
#         print("\nGenerating Voice Successful\n")

#         # Step 3: Update purchase status to 'in-progress'
#         update_purchase_status_to_in_progress(connection, purchase_id)

#         # Step 4: Retrieve associated files
#         files = get_files_for_video(connection, purchase_id)
#         print(f"Files for video: {files}")

#         # Step 5: Generate final video
#         final_video_path = generate_video(
#             purchase_id,
#             pending_purchase['created_at'],
#             pending_purchase['user_email'],
#             files,
#             "static/generated_videos",
#             connection,
#             generated_audio
#         )
#         print(f"Generated video path: {final_video_path}")

#         # Step 6: Update video status to 'completed'
#         update_video_status(connection, purchase_id, 'completed')

#         connection.commit()
#         print("Video processed successfully.")

#     except Exception as e:
#         print(f"Error in process_pending_videos: {e}")
#         connection.rollback()

#     finally:
#         cursor.close()
#         connection.close()

        

