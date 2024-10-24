from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from alembic.database import get_db
from models import VideoPurchase
from schemas import VideoPurchaseSchema
from routers.payments import create_payment

router = APIRouter()

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchaseSchema, db: Session = Depends(get_db)):
    try:
        # Insert the data into the video_purchases table
        new_purchase = VideoPurchase(
            user_email=purchase.user_email,
            receiver_phone=purchase.receiver_phone,
            send_date=purchase.send_date,
            video_name=purchase.video_name
        )
        create_payment(purchase.amount, purchase.video_name)
        db.add(new_purchase)
        db.commit()
        db.refresh(new_purchase)

        return {"status": "success", "message": "Video purchase scheduled successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
