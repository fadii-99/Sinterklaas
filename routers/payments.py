from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from database import get_db
# from models import Payment
from schemas import PaymentRequest
from mollie.api.client import Client
import os
from celery_app import process_pending_videos
import json
from utils import send_receipt_email


router = APIRouter()

mollie_client = Client()
mollie_client.set_api_key(os.environ.get('mollie_api'))

def create_payment(amount: str, videoName: str, user_email: str, db):
    try:
        # Convert amount to float to ensure correct formatting
        amount_value = float(amount)

        payment = mollie_client.payments.create({
            'amount': {
                'currency': 'EUR',
                'value': f'{amount_value:.2f}'  # Now formatted correctly
            },
            'description': f'Video purchase for: {videoName}',
            # 'redirectUrl': 'https://a441-203-101-190-149.ngrok-free.app/payment-success',
            'redirectUrl': 'http://134.122.63.191:3000/payment-success',
            # 'webhookUrl': 'https://a441-203-101-190-149.ngrok-free.app/webhook',
            'webhookUrl': 'http://134.122.63.191:9000/webhook',
            'metadata': {
                'video_name': videoName
            },
            'locale': 'nl_NL'
        })
        with db.cursor() as cursor:
            cursor.execute("""
                INSERT INTO payments (payment_id, video_name, amount, currency, status, user_email)
                VALUES (%s, %s, %s, %s, %s, %s)
            """, (payment['id'], videoName, amount_value, 'EUR', 'pending', user_email))

            # Commit the transaction
            db.commit()
        checkout_url = payment['_links']['checkout']['href']
        return {"checkout_url": checkout_url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create payment: {str(e)}")


def start():
    process_pending_videos.delay()


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
                UPDATE payments
                SET status = %s
                WHERE payment_id = %s
            """, ('completed', payment_id))

            cursor.execute("""
                SELECT user_email FROM payments WHERE payment_id = %s
            """, (payment_id,))
            email_result = cursor.fetchone()


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

            # process_pending_videos.delay()
            try:
                process_pending_videos.delay()
            except Exception as task_error:
                print(f"Error while processing pending videos: {task_error}")

            print('sending reciept')

            send_receipt_email(email_result[0], payment_id, video_name, amount_value, currency)
            print('sent reciept')

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
