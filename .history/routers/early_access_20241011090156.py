from fastapi import FastAPI, Depends, HTTPException, APIRouter
from schemas import EarlyAccessSchema  # Import Pydantic models
from database import get_db

router = APIRouter()

@router.post("/earlyaccess/")
def add_early_access(data: EarlyAccessSchema, db=Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute("SELECT email FROM early_access WHERE email = %s", (data.email,))
    existing_email = cursor.fetchone()
    
    if existing_email:
        return {"message": "This email is already on the early access list."}
    
    cursor.execute("INSERT INTO early_access (email) VALUES (%s)", (data.email,))
    db.commit()
    cursor.close()
    send_email(data.email, 'Coming Soon', 'body')
    
    return {"message": "You have been added to the early access list!"}