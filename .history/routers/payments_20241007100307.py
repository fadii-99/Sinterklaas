from fastapi import APIRouter, HTTPException, Request
from mollie.api.client import Client
from database import connection
from pydantic import BaseModel

router = APIRouter()

mollie_client = Client()
mollie_client.set_api_key('test_WPyKyvsjBxesjFHx94juxuMxeJbWS6')

class PaymentRequest(BaseModel):
    video_id: str
    amount: float
    currency: str
    email: str

@router.get("/create-payment/")
def create_payment(amount, videoName):
    try:
        payment = mollie_client.payments.create({
            'amount': {
                'currency': 'EUR',
                'value': amount
            },
            'description': f'Video purchase for ID: 1',
            'redirectUrl': 'https://9d23-182-183-7-2.ngrok-free.app/payment-success',
            'webhookUrl': 'https://9d23-182-183-7-2.ngrok-free.app/webhook',
            'metadata': {
                'Video': videoName
            }
        })
        checkout_url = payment['_links']['checkout']['href']
        return {"checkout_url": checkout_url}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create payment: {str(e)}")

@router.post("/webhook")
async def webhook(request: Request):
    try:
        payment_info = await request.json()

        if payment_info['status'] == 'paid':
            video_name = payment_info['metadata']['video_id']
            payment_id = payment_info['id']
            amount = payment_info['amount']['value']
            currency = payment_info['amount']['currency']

            cursor = connection.cursor()
            update_query = """
            UPDATE video_purchases
            SET payment_status = 'completed'
            WHERE video_name = %s
            """
            cursor.execute(update_query, (video_name,))

            insert_query = """
            INSERT INTO payments (payment_id, video_id, amount, currency, payment_status)
            VALUES (%s, %s, %s, %s, 'completed')
            """
            cursor.execute(insert_query, (payment_id, video_name, amount, currency))

            cursor.close()
            connection.commit()

        return {"status": "received"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")

@router.post("/cancel-payment/{payment_id}")
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
