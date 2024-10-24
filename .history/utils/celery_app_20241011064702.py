from celery import Celery
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


@celery_app.task
def process_pending_videos():
    """
    Celery task to process video purchases with pending status.
    It generates a video for each purchase and saves the final video path.
    """
    db = get_db()  # Function to get DB session
    try:
        # Fetch all pending purchases
        pending_purchases = get_pending_purchases(db)

        for purchase in pending_purchases:
            purchase_id = purchase.id
            print(f"Processing purchase ID: {purchase_id}")

            # Fetch files for this purchase (images, videos)
            files = get_files_for_purchase(db, purchase_id)

            # Simulate video generation (you can replace this with your actual video generation logic)
            print(f"Generating video for purchase ID: {purchase_id}")
            time.sleep(10)  # Simulating video generation delay
            final_video_path = generate_video(files)  # Your actual video generation function

            # Save final video path in the final_videos table
            final_video_dir = "/home/fawad/Desktop/PYTHON/sinter_backend/static/generated_videos"
            final_video_file_path = os.path.join(final_video_dir, f"video_{purchase_id}.mp4")
            
            # Save the generated video to disk
            with open(final_video_file_path, 'wb') as f:
                f.write(final_video_path)  # This is just a placeholder for actual video saving

            # Save the video path to the final_videos table
            save_final_video(db, purchase_id, final_video_file_path, purchase.receiver_phone, purchase.send_date)

            # Update the video purchase status to 'completed'
            update_purchase_status(db, purchase_id, 'completed')

        db.commit()
        print("All pending videos processed.")

    except Exception as e:
        print(f"Error in process_pending_videos: {e}")
        db.rollback()
    finally:
        db.close()
