from pydantic import BaseModel
from typing import List

class EarlyAccessSchema(BaseModel):
    email: str

    class Config:
        orm_mode = True

class VideoPurchaseSchema(BaseModel):
    user_email: str
    receiver_phone: List[str]  # Now this can hold more than one phone number
    send_date: str
    video_name: str
    voice_path: str  # You can remove this if you're loading the voice file based on video_name
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


class promptVoice(BaseModel):
    prompt: str

class taskStatus(BaseModel):
    task_id: str
