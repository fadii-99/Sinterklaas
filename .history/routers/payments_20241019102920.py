from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
# from models import Payment
from schemas import PaymentRequest
from mollie.api.client import Client
import os
from celery_app import process_pending_videos



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
        body = await request.body()
        if not body:
            raise HTTPException(status_code=400, detail="Empty request body")
        # Parse the incoming payment info
        payment_info = await request.json()

        # Check if the payment is marked as 'paid'
        if payment_info['status'] == 'paid':
            video_name = payment_info['metadata']['video_name']
            payment_id = payment_info['id']
            amount = payment_info['amount']['value']
            currency = payment_info['amount']['currency']
            
            # Update payment status in the video_purchases table
            db.execute("""
                UPDATE video_purchases
                SET payment_status = 'completed'
                WHERE video_name = :video_name
            """, {"video_name": video_name})

            # Insert payment details into the payments table
            db.execute("""
                INSERT INTO payments (payment_id, video_name, amount, currency, payment_status)
                VALUES (:payment_id, :video_name, :amount, :currency, 'completed')
            """, {
                "payment_id": payment_id,
                "video_name": video_name,
                "amount": amount,
                "currency": currency
            })

            # Commit the transaction
            db.commit()

            # Trigger background task for processing videos
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
