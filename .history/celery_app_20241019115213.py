from celery import Celery
from database import get_db_connection  # Ensure this import is correct
import os

from utils import (
    update_video_status, get_pending_video, get_files_for_video,
    generate_video, update_purchase_status_to_in_progress
)
from database import get_db

celery_app = Celery(
    'sintmagie',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

celery_app.conf.update(
    worker_concurrency=5,
    task_acks_late=True,
    worker_prefetch_multiplier=1
)

from celery import Celery
from database import get_db_connection
from utils import (
    update_video_status, get_pending_video, get_files_for_video,
    generate_video, update_purchase_status_to_in_progress
)

celery_app = Celery(
    'sintmagie',
    broker='redis://localhost:6379/0',
    backend='redis://localhost:6379/0'
)

@celery_app.task
def process_pending_videos():
    """Process pending video purchases."""
    connection = get_db_connection()  # Ensure direct connection for Celery
    cursor = connection.cursor(dictionary=True)  # Use dictionary cursor

    try:
        # Retrieve a pending video purchase
        pending_purchase = get_pending_video(connection)

        if not pending_purchase:
            print("No pending videos found.")
            return  # Exit if no pending purchase found

        # Access values from the dictionary
        purchase_id = pending_purchase['id']
        voice_path = pending_purchase['voice_path']
        print(f"Processing purchase ID: {purchase_id}")

        # Update the purchase status to 'in-progress'
        update_purchase_status_to_in_progress(connection, purchase_id)

        # Retrieve associated files
        files = get_files_for_video(connection, purchase_id)
        print(f"get_files_for_video: {files}")

        final_video_dir = "static/generated_videos"
        print(f"Generating video for purchase ID: {purchase_id}")

        # Generate the final video
        final_video_path = generate_video(purchase_id, files, final_video_dir, connection)
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


        

