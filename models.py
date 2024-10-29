from sqlalchemy import Column, Integer, String, Float
from database import Base

class EarlyAccess(Base):
    __tablename__ = 'early_access'
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)

class VideoPurchase(Base):
    __tablename__ = 'video_purchases'
    id = Column(Integer, primary_key=True, index=True)
    user_email = Column(String, index=True)
    receiver_phone = Column(String)
    send_date = Column(String)
    video_name = Column(String)
    payment_status = Column(String, default='pending')

class Payment(Base):
    __tablename__ = 'payments'
    id = Column(Integer, primary_key=True, index=True)
    payment_id = Column(String, unique=True, index=True)
    video_id = Column(String)
    amount = Column(Float)
    currency = Column(String)
    payment_status = Column(String, default='pending')
