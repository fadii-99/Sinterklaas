from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from alembic.database import get_db
from models import Payment
from schemas import PaymentRequest
from mollie.api.client import Client

router = APIRouter()

mollie_client = Client()
mollie_client.set_api_key('test_WPyKyvsjBxesjFHx94juxuMxeJbWS6')

@router.get("/create-payment/")
def create_payment(amount, videoName, db: Session = Depends(get_db)):
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
