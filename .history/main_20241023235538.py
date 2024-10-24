from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from routers import early_access, purchases, welcome_messages, payments
from apscheduler.schedulers.background import BackgroundScheduler
from utils import send_whatsapp_video,send_email_with_video
from database import get_db_connection 

# from utils import payments


app = FastAPI()
cache = LRUCache(maxsize=1000)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(early_access.router)
app.include_router(payments.router)
app.include_router(purchases.router)
app.include_router(welcome_messages.router)





scheduler = BackgroundScheduler()


def send_message():
    # Simulate sending the message (Replace with actual logic)
    print("Message sent!")
    return True

def load_pending_video():
    connection = get_db_connection() 
    cursor = connection.cursor(dictionary=True) 
    query = """
        SELECT id, purchase_id, final_video_path, send_status 
        FROM final_videos 
        WHERE send_status = 'pending' 
        ORDER BY id ASC 
        LIMIT 1;
    """
    cursor.execute(query)
    pending_video = cursor.fetchone()

    if pending_video:
        print(f"Processing video: {pending_video['final_video_path']}")

        purchase_query = """
                    SELECT receiver_phone 
                    FROM video_purchases 
                    WHERE id = %s;
                """
        cursor.execute(purchase_query, (pending_video['purchase_id'],))
        purchase = cursor.fetchone()
        if purchase:

            if send_message(purchase['receiver_phone'], pending_video['final_video_path']):
                update_query = """
                    UPDATE final_videos 
                    SET send_status = 'sent' 
                    WHERE id = %s;
                """
                cursor.execute(update_query, (pending_video['id'],))
                connection.commit()
                print(f"Video ID {pending_video['id']} marked as sent.")
    else:
        print("No pending videos to process.")




# Schedule the job to run every 10 seconds
scheduler.add_job(load_pending_video, 'interval', seconds=10)

# Start the scheduler
scheduler.start()

# def shutdown_event():
#     """Shutdown the scheduler when the app stops."""
#     scheduler.shutdown()

# shutdown_event()