from fastapi import FastAPI, HTTPException, BackgroundTasks, Request
from fastapi.middleware.cors import CORSMiddleware
from cachetools import LRUCache
from mollie.api.client import Client
from utils.email_sender import start_background_task
from routers import early_access, payments, purchases, welcome_messages


app = FastAPI()
cache = LRUCache(maxsize=1000)

# Mollie client setup
mollie_client = Client()
mollie_client.set_api_key('test_WPyKyvsjBxesjFHx94juxuMxeJbWS6')

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
