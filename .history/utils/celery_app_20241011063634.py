from celery import Celery

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
def process_video_generation():
    while True:
        # Fetch next content from the database that needs video generation
        content = get_next_content()
        
        if content:
            # Process the content to generate the video
            generate_video_from_content(content)
            
            # Mark content as processed in the database
            mark_content_processed(content)
        
        # Sleep to avoid hammering the database continuously
        sleep(10)  # Adjust sleep duration based on your requirements