from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler

# Initialize FastAPI
app = FastAPI()

# Create an instance of the BackgroundScheduler
scheduler = BackgroundScheduler()

def print_message():
    print("OK Fawad")

# Add the job to run every 10 seconds
scheduler.add_job(print_message, 'interval', seconds=10)

# Start the scheduler
scheduler.start()

def shutdown_event():
    """Shutdown the scheduler when the app stops."""
    scheduler.shutdown()

# shutdown_event()