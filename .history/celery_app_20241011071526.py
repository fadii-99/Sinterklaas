from celery import Celery
from utils import update_purchase_status, get_pending_video, get_files_for_video, sav
from database import SessionLocal 

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
    db = SessionLocal()  
    try:
        pending_purchase = get_pending_video(db)

        if pending_purchase:
            purchase_id, voice_path = pending_purchase
            print(f"Processing purchase ID: {purchase_id}")

            update_purchase_status_to_in_progress(db, purchase_id)

            files = get_files_for_video(db, purchase_id)

            final_video_dir = "/home/fawad/Desktop/PYTHON/sinter_backend/static/generated_videos"
            print(f"Generating video for purchase ID: {purchase_id}")
            
            final_video_path = generate_video(files, final_video_dir)


            update_purchase_status(db, purchase_id, 'completed')

        db.commit()
        print("All pending videos processed.")

    except Exception as e:
        print(f"Error in process_pending_videos: {e}")
        db.rollback()

    finally:
        db.close()
