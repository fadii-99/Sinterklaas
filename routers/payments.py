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

def create_payment(amount: str, videoName: str, user_email: str, purchase_id, db):
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
                SELECT * FROM video_purchases WHERE id = %s
            """, (purchase_id,))
            purchases_data = cursor.fetchone()


            print(purchase_id)


            cursor.execute("""
                INSERT INTO payments (payment_id, video_name, amount, currency, status, user_email, video_purchase_id)
                VALUES (%s, %s, %s, %s, %s, %s, %s)
            """, (payment['id'], videoName, amount_value, 'EUR', 'pending', user_email, purchase_id))


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
        form_data = await request.form()
        payment_id = form_data.get('id')

        print(f"Payment ID received: {payment_id}")

        if not payment_id:
            raise HTTPException(status_code=400, detail="Payment ID is missing.")

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

            cursor = db.cursor()

            cursor.execute("""
                UPDATE payments
                SET status = %s
                WHERE payment_id = %s
            """, ('completed', payment_id))

            cursor.execute("""
                SELECT * FROM payments WHERE payment_id = %s
            """, (payment_id,))

            payment_info = cursor.fetchone()
            if not payment_info:
                raise ValueError("No payment found for the given payment ID.")

            video_purchase_id = payment_info[10]  # Assuming this holds the video_purchase_id
            cursor.execute("""
                SELECT * FROM video_purchases WHERE id = %s
            """, (video_purchase_id,))
            purchases_data = cursor.fetchone()
            if not purchases_data:
                raise ValueError("No purchase data found for the given video purchase ID.")

            cursor.execute("""
                UPDATE video_purchases
                SET payment_status = %s
                WHERE id = %s
            """, ('completed', video_purchase_id))

            # cursor.execute("""
            #     INSERT INTO payments (payment_id, video_name, amount, currency, status)
            #     VALUES (%s, %s, %s, %s, 'completed')
            # """, (payment_id, video_name, amount_value, currency))

            # result = cursor.fetchone()
            # created_at = result['created_at'] if result else None

            db.commit()
            cursor.close()

            try:
                process_pending_videos.delay()
            except Exception as task_error:
                print(f"Error while processing pending videos: {task_error}")

            print('Sending receipt...')
            receiver = purchases_data[2] if purchases_data[2] else purchases_data[17]
            send_receipt_email(
                payment_info[6], payment_id, video_name, amount_value, currency, receiver, purchases_data[3]
            )
            print('Receipt sent')

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
