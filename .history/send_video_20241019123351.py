from fastapi import FastAPI
from apscheduler.schedulers.background import BackgroundScheduler

# Initialize FastAPI
app = FastAPI()

# Create an instance of the BackgroundScheduler
scheduler = BackgroundScheduler()

def print_message():
    """Task that prints a message every 10 seconds."""
    print("OK Fawad")

# Add the job to run every 10 seconds
scheduler.add_job(print_message, 'interval', seconds=10)

# Start the scheduler
scheduler.start()

@app.on_event("shutdown")
def shutdown_event():
    """Shutdown the scheduler when the app stops."""
    scheduler.shutdown()

@app.get("/")
async def root():
    """Root endpoint to confirm the server is running."""
    return {"message": "Scheduler is running!"}
