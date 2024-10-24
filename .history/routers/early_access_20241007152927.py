from fastapi import FastAPI, Depends, HTTPException
from schemas import EarlyAccessSchema  # Import Pydantic models
from database import get_db

app = FastAPI()

@app.post("/earlyaccess/")
def add_early_access(data: EarlyAccessSchema, db=Depends(get_db)):
    cursor = db.cursor()
    
    # Check if the email already exists
    cursor.execute("SELECT email FROM early_access WHERE email = %s", (data.email,))
    existing_email = cursor.fetchone()
    
    if existing_email:
        cursor.close()
        raise HTTPException(status_code=400, detail="This email is already on the early access list.")
    
    # Insert new email into early_access table
    cursor.execute("INSERT INTO early_access (email) VALUES (%s)", (data.email,))
    db.commit()
    cursor.close()
    
    return {"message": "You have been added to the early access list!"}
