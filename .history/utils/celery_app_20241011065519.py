from celery import Celery
import os
from database import get_db

celery_app = Celery(
    'sintmagie',
    broker='redis://localhost:6379/0',  # Redis as the message broker
    backend='redis://localhost:6379/0'  # Redis as the result backend
)

# Celery configuration
celery_app.conf.update(
    worker_concurrency=5,  # Maximum number of concurrent tasks a worker can handle
    task_acks_late=True,  # Ensure tasks are acknowledged only after they are completed
    worker_prefetch_multiplier=1  # Prevent workers from fetching too many tasks in advance
)



def get_pending_video(db):
    query = """
        SELECT id, voice_path
        FROM video_purchases 
        WHERE video_status = 'pending'
    """
    cursor = db.cursor()
    cursor.execute(query)
    pending_purchases = cursor.fetchall()
    cursor.close()
    return pending_purchases


def get_files_for_purchase(db, purchase_id: int):
    query = """
        SELECT file_type, file_path 
        FROM video_files 
        WHERE purchase_id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id,))
    files = cursor.fetchall()
    cursor.close()
    return files


def save_final_video(db, purchase_id: int, final_video_path: str, receiver_phone: str, send_date: str):
    query = """
        INSERT INTO final_videos (purchase_id, final_video_path, receiver_phone, send_date)
        VALUES (%s, %s, %s, %s)
    """
    cursor = db.cursor()
    cursor.execute(query, (purchase_id, final_video_path, receiver_phone, send_date))
    db.commit()
    cursor.close()



def update_purchase_status(db, purchase_id: int, status: str):
    query = """
        UPDATE video_purchases 
        SET video_status = %s 
        WHERE id = %s
    """
    cursor = db.cursor()
    cursor.execute(query, (status, purchase_id))
    db.commit()
    cursor.close()

def generate_video():
    return True
@celery_app.task
def process_pending_videos():
    db = get_db()  
    try:
        pending_video = get_pending_video(db)

        for purchase in pending_video:
            purchase_id = purchase.id
            print(f"Processing purchase ID: {purchase_id}")

            files = get_files_for_purchase(db, purchase_id)

            final_video_dir = "/home/fawad/Desktop/PYTHON/sinter_backend/static/generated_videos"
            print(f"Generating video for purchase ID: {purchase_id}")
            final_video_path = generate_video(files, final_video_dir)  

            final_video_file_path = os.path.join(final_video_dir, f"video_{purchase_id}.mp4")
            
            with open(final_video_file_path, 'wb') as f:
                f.write(final_video_path) 

            save_final_video(db, purchase_id, final_video_file_path, purchase.receiver_phone, purchase.send_date)

            update_purchase_status(db, purchase_id, 'completed')

        db.commit()
        print("All pending videos processed.")

    except Exception as e:
        print(f"Error in process_pending_videos: {e}")
        db.rollback()
    finally:
        db.close()