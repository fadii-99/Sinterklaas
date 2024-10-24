from pydantic import BaseModel

class EarlyAccessSchema(BaseModel):
    email: str

    class Config:
        orm_mode = True

class VideoPurchaseSchema(BaseModel):
    user_email: str
    receiver_phone: str
    send_date: str
    video_name: str
    images : list
    video_name_url: str
    text :str
    amount: float

    class Config:
        orm_mode = True

class PaymentRequest(BaseModel):
    video_id: str
    amount: float
    currency: str
    email: str

    class Config:
        orm_mode = True
