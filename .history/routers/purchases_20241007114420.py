from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from schemas import VideoPurchaseSchema
from routers.payments import create_payment

router = APIRouter()

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchaseSchema, db: Session = Depends(get_db)):
    try:
        # Insert the data into the video_purchases table
        cursor = db.cursor()
        insert_query = """
            INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name, payment_status)
            VALUES (%s, %s, %s, %s, %s)
        """
        cursor.execute(insert_query, (
            purchase.user_email,
            purchase.receiver_phone,
            purchase.send_date,
            purchase.video_name,
            'pending' 
        ))
        db.commit()
        cursor.close()

        return {"status": "success", "message": "Video purchase scheduled successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
