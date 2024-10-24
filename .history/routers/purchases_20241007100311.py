from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import connection

router = APIRouter()

class VideoPurchase(BaseModel):
    user_email: str
    receiver_phone: str
    send_date: str
    video_name: str
    amount: float

@router.post("/purchase-video/")
async def purchase_video(purchase: VideoPurchase):
    try:
        cursor = connection.cursor()

        insert_query = """
        INSERT INTO video_purchases (user_email, receiver_phone, send_date, video_name)
        VALUES (%s, %s, %s, %s)
        """
        # create_payment(purchase.amount, purchase.video_name)
        cursor.execute(insert_query, (purchase.user_email, purchase.receiver_phone, purchase.send_date, purchase.video_name))

        cursor.close()
        connection.commit()

        return {"status": "success", "message": "Video purchase scheduled successfully."}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"An error occurred: {str(e)}")
