from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
# from models import Payment
from schemas import PaymentRequest
from mollie.api.client import Client
import os
from celery_app import process_pending_videos
import json



router = APIRouter()

mollie_client = Client()
mollie_client.set_api_key(os.environ.get('mollie_api'))

def create_payment(amount: str, videoName: str):
    try:
        # Convert amount to float to ensure correct formatting
        amount_value = float(amount)

        payment = mollie_client.payments.create({
            'amount': {
                'currency': 'EUR',
                'value': f'{amount_value:.2f}'  # Now formatted correctly
            },
            'description': f'Video purchase for: {videoName}',
            'redirectUrl': 'https://ea73-182-183-41-236.ngrok-free.app/payment-success',
            'webhookUrl': 'https://ea73-182-183-41-236.ngrok-free.app/webhook',
            'metadata': {
                'video_name': videoName
            }
        })
        checkout_url = payment['_links']['checkout']['href']
        return {"checkout_url": checkout_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create payment: {str(e)}")



@router.get("/payment-success/")
async def payment_success():
    print('\nPayment Successful\n')
    return {"message": "Payment Successful"}

db = get_db()

@router.post("/webhook")
async def webhook(request: Request):
    print('inside webhook')

    try:
        # Log raw request body and headers
        body = await request.body()
        headers = request.headers
        print(f"Raw Body: {body.decode('utf-8')}")
        print(f"Headers: {headers}")

        # Check Content-Type
        content_type = headers.get("Content-Type", "")
        print(f"Content-Type: {content_type}")

        if content_type == "application/x-www-form-urlencoded":
            form_data = await request.form()
            payment_info = dict(form_data)
            print(f"Form Data: {payment_info}")

            # Parse nested JSON strings if present
            status = payment_info.get('status')
            metadata = json.loads(payment_info.get('metadata', '{}'))
            amount = json.loads(payment_info.get('amount', '{}'))

        else:
            payment_info = await request.json()
            print(f"JSON Data: {payment_info}")

            status = payment_info.get('status')
            metadata = payment_info.get('metadata', {})
            amount = payment_info.get('amount', {})

        print(f"Payment Status: {status}")
        print(f"Metadata: {metadata}")
        print(f"Amount: {amount}")

        if status == 'paid':
            # Process the payment
            video_name = metadata.get('video_name')
            payment_id = payment_info.get('id')
            amount_value = amount.get('value')
            currency = amount.get('currency')

            db.execute("""
                UPDATE video_purchases
                SET payment_status = 'completed'
                WHERE video_name = :video_name
            """, {"video_name": video_name})

            db.execute("""
                INSERT INTO payments (payment_id, video_name, amount, currency, payment_status)
                VALUES (:payment_id, :video_name, :amount, :currency, 'completed')
            """, {
                "payment_id": payment_id,
                "video_name": video_name,
                "amount": amount_value,
                "currency": currency
            })

            db.commit()
            process_pending_videos.delay()

        return {"status": "received"}

    except Exception as e:
        print(f"Error in webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")



@router.post("/cancel-payment")
async def cancel_payment(payment_id: str):
    try:
        payment = mollie_client.payments.get(payment_id)
        if payment['status'] == 'open':
            mollie_client.payments.delete(payment_id)
            return {"status": "success", "message": f"Payment {payment_id} has been successfully canceled."}
        else:
            return {"status": "failed", "message": f"Payment {payment_id} cannot be canceled because its status is {payment['status']}."}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))
