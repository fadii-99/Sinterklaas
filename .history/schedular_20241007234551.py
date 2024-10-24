from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.interval import IntervalTrigger
from database import get_db
import os
from datetime import datetime




scheduler = BackgroundScheduler()

def check_scheduled_videos():
    with get_db() as db:
        cursor = db.cursor()
        query = """
            SELECT id, user_email, receiver_phone, send_date, video_name
            FROM video_purchases
            WHERE payment_status = 'pending'
        """
        cursor.execute(query)
        purchases = cursor.fetchall()

        current_time = datetime.now()
        for purchase in purchases:
            send_date = purchase['send_date']
            if send_date <= current_time:
                # Call your method to send the video
                send_whatsapp_video(purchase['receiver_phone'], purchase['video_name'])
                
                # Update payment status to 'completed'
                update_query = """
                    UPDATE video_purchases
                    SET payment_status = 'completed'
                    WHERE id = %s
                """
                cursor.execute(update_query, (purchase['id'],))
                db.commit()
        
        cursor.close()

# Add the job to the scheduler to run every minute
scheduler.add_job(check_scheduled_videos, IntervalTrigger(minutes=1))

# Start the scheduler
# scheduler.start()