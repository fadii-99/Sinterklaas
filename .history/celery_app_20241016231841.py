from celery import Celery
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

@celery_app.task
def process_pending_videos():
    connection = get_db()
    cursor = connection.cursor(dictionary=True)  # Use dict cursor if needed for easy row handling

    try:
        pending_purchase = get_pending_video(cursor)

        if pending_purchase:
            purchase_id, voice_path = pending_purchase
            print(f"Processing purchase ID: {purchase_id}")

            update_purchase_status_to_in_progress(cursor, purchase_id)

            files = get_files_for_video(cursor, purchase_id)

            final_video_dir = "static/generated_videos"
            print(f"Generating video for purchase ID: {purchase_id}")
            
            final_video_path = generate_video(purchase_id, files, final_video_dir, cursor)

            update_video_status(cursor, purchase_id, 'completed')

        connection.commit()
        print("All pending videos processed.")

    except Exception as e:
        print(f"Error in process_pending_videos: {e}")
        connection.rollback()

    finally:
        cursor.close()
        connection.close()
