from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import EarlyAccess
from schemas import EarlyAccessSchema

router = APIRouter()

@router.post("/earlyaccess/")
async def earlyaccess(data: EarlyAccessSchema, db: Session = Depends(get_db)):
    existing_email = db.query(EarlyAccess).filter(EarlyAccess.email == data.email).first()
    
    if existing_email:
        return {"message": "This email is already on the early access list."}
    
    new_entry = EarlyAccess(email=data.email)
    db.add(new_entry)
    db.commit()
    db.refresh(new_entry)
    
    return {"message": "You have been added to the early access list!"}
