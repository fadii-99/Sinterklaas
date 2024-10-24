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
    connection = get_db_connection()  # Direct connection for Celery
    cursor = connection.cursor(dictionary=True)

    try:
        # Retrieve a pending video purchase
        pending_purchase = get_pending_video(connection)

        if pending_purchase:
            purchase_id = pending_purchase['id']
            voice_path = pending_purchase['voice_path']
            print(f"Processing purchase ID: {purchase_id}")

            # Mark the purchase as 'in-progress'
            update_purchase_status_to_in_progress(connection, purchase_id)

            # Fetch associated files for this purchase
            files = get_files_for_video(connection, purchase_id)

            final_video_dir = "static/generated_videos"
            print(f"Generating video for purchase ID: {purchase_id}")

            # Generate the final video
            final_video_path = generate_video(purchase_id, files, final_video_dir, connection)

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
            SELECT id, voice_path
            FROM video_purchases 
            WHERE video_status = 'pending'
            LIMIT 1
        """
        cursor.execute(query)
        pending_purchase = cursor.fetchone()  # Fetch the first pending purchase


        # Log what we retrieved to debug
        print(f"\n\n\nPending purchase: {pending_purchase}")
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


def generate_video(purchase_id: int, files, final_video_dir: str, connection):
    """Generate the final video."""
    image_paths = [file['file_path'] for file in files if file['file_type'] == 'image']
    video_paths = [file['file_path'] for file in files if file['file_type'] == 'video']

    # Create the output directory if it doesn't exist
    if not os.path.exists(final_video_dir):
        os.makedirs(final_video_dir)

    # Define the final video path
    final_video_name = f"final_output_{purchase_id}.mp4"
    final_video_path = os.path.join(final_video_dir, final_video_name)

    # Process media files and save the final video
    media_processor = MediaProcessor(image_paths, video_paths)
    media_processor.save_final_video(final_video_path)

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
