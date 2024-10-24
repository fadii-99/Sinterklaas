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
            'redirectUrl': 'https://fe3f-182-183-38-236.ngrok-free.app/payment-success',
            'webhookUrl': 'https://fe3f-182-183-38-236.ngrok-free.app/webhook',
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

# db = get_db()

@router.post("/webhook")
async def webhook(request: Request, db=Depends(get_db)):
    try:
        # Parse form data to get the payment ID
        form_data = await request.form()
        payment_id = form_data.get('id')

        print(f"Payment ID received: {payment_id}")

        if not payment_id:
            raise HTTPException(status_code=400, detail="Payment ID is missing.")

        # Fetch payment details from Mollie
        payment = mollie_client.payments.get(payment_id)
        status = payment.get('status')
        metadata = payment.get('metadata', {})
        amount = payment.get('amount', {})

        print(f"Payment Status from Mollie: {status}")
        print(f"Metadata: {metadata}")
        print(f"Amount: {amount}")

        if status == 'paid':
            video_name = metadata.get('video_name')
            amount_value = amount.get('value')
            currency = amount.get('currency')

            # Use a cursor to execute SQL queries
            cursor = db.cursor()

            # Update the payment status in the video_purchases table
            cursor.execute("""
                UPDATE video_purchases
                SET payment_status = %s
                WHERE video_name = %s
            """, ('completed', video_name))

            # Insert payment details into the payments table
            cursor.execute("""
                INSERT INTO payments (payment_id, video_name, amount, currency, status)
                VALUES (%s, %s, %s, %s, 'completed')
            """, (payment_id, video_name, amount_value, currency))

            # Commit the transaction and close the cursor
            db.commit()
            cursor.close()

            # Trigger background video processing
            process_pending_videos.delay()

        return {"status": "received"}

    except Exception as e:
        print(f"Error in webhook: {str(e)}")
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
# process_pending_videos.delay()



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
