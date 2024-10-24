from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from database import connection

router = APIRouter()

class EarlyAccess(BaseModel):
    email: str

@router.post("/earlyaccess/")
async def earlyaccess(data: EarlyAccess):
    cursor = connection.cursor()
    cursor.execute("SELECT email FROM early_access WHERE email = %s", (data.email,))
    existing_email = cursor.fetchone()

    if existing_email:
        return {"message": "This email is already on the early access list."}

    cursor.execute("INSERT INTO early_access (email) VALUES (%s)", (data.email,))
    connection.commit()
    return {"message": "You have been added to the early access list!"}
