from celery import Celery

celery_app = Celery(
    'SinterKlaas',
    broker='redis://localhost:6379/0',  # Redis as the message broker
    backend='redis://localhost:6379/0'  # Redis as the result backend
)

# Celery configuration
celery_app.conf.update(
    worker_concurrency=5,  # Maximum number of concurrent tasks a worker can handle
    task_acks_late=True,  # Ensure tasks are acknowledged only after they are completed
    worker_prefetch_multiplier=1  # Prevent workers from fetching too many tasks in advance
)
