from fastapi import FastAPI, Depends, HTTPException, APIRouter, Form
from fastapi.responses import JSONResponse
import os
from schemas import EarlyAccessSchema  
from database import get_db
from utils import send_email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
import smtplib
from email.mime.application import MIMEApplication
import jwt
from datetime import datetime, timedelta, timezone
from email import encoders
from decimal import Decimal

router = APIRouter()
SECRET_KEY = "secrete-of-sinterklaas"



def generate_jwt_token(user):
    expiration_time = datetime.now(timezone.utc) + timedelta(hours=10)

    payload = {
        'user_id': user.id,
        'username': user.username,
        'email': user.email,
        'exp': expiration_time.timestamp(),
    }
    token = jwt.encode(payload, SECRET_KEY, algorithm='HS256')

    return token


def decode_jwt_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token")





@router.get("/create-admin")
async def create_or_update_admin(db=Depends(get_db)):
    cursor = db.cursor()
    try:
        username = 'admin'
        email = 'admin@admin.com'
        password = 'admin1234'
        hashed_password = password
        # hashed_password = hash_password(password)

        cursor.execute("SELECT * FROM users WHERE username = %s OR email = %s", (username, email))
        existing_user = cursor.fetchone()
        print(existing_user['id'])

        if existing_user:
            cursor.execute(
                "UPDATE users SET password = %s WHERE id = %s",
                (hashed_password, existing_user['id'])  
            )
            db.commit()
            return JSONResponse(status_code=200, content={"message": "User updated successfully."})
        else:
            cursor.execute(
                "INSERT INTO users (username, email, password) VALUES (%s, %s, %s)",
                (username, email, hashed_password)
            )
            db.commit()
            return JSONResponse(status_code=201, content={"message": "User created successfully."})
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=400, detail="Username or email already exists.")
    finally:
        cursor.close()



@router.post("/admin/login/")
async def login(email: str = Form(...), password: str = Form(...), db=Depends(get_db)):
    cursor = db.cursor()
    try:
        # cursor.execute("SELECT * FROM users WHERE email = %s AND password = %s", (email,))
        # user = cursor.fetchone()
        # if not user:
        #      return JSONResponse(scontent={"error": 'Invalid Credentials'},status_code=400)

        if password == 'admin1234' and email == 'admin':
            # access_token = generate_jwt_token(user)
            access_token = 'authorized'
            return JSONResponse(content={"access_token": access_token})
    
    except Exception as e:
        print(f"Error during login: {e}")
        raise HTTPException(status_code=500, detail="An error occurred during login.")
    
    finally:
        cursor.close()







@router.post("/admin/video-purchase/delete")
async def delete_video_purchase(id: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM video_purchases WHERE id = %s", (id,))
        db.commit()

        return JSONResponse(status_code=200, content={"message": "Video purchase deleted successfully."})

    except Exception as e:
        print(f"Error deleting video purchase: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the video purchase.")
    
    finally:
        cursor.close()













def send_on_email(email, video):
    print(video)
    email_host = os.getenv('EMAIL_HOST')
    email_port = int(os.getenv('EMAIL_PORT'))
    email_user = os.getenv('EMAIL_USER')
    email_pass = os.getenv('EMAIL_PASS')

    # Create the email message
    msg = MIMEMultipart('alternative')
    msg['From'] = email_user
    msg['To'] = email
    msg['Subject'] = 'Gifted Video'

   

    html_body = """
    <html>
    <body>
        <p>Hallo!</p> 
        <p>Geniet van je cadeauvideo!</p>
    </body>
    </html>
    """
    msg.attach(MIMEText(html_body, 'html'))

    # Attach the video file
    try:
        print(video)
        with open(video, 'rb') as attachment:
            part = MIMEBase('application', 'octet-stream')
            part.set_payload(attachment.read())
            encoders.encode_base64(part)
            part.add_header(
                'Content-Disposition',
                f'attachment; filename={video}',
            )
            msg.attach(part)
    except Exception as e:
        print(f"Error attaching the video file: {str(e)}")
        return

    # Send the email
    try:
        with smtplib.SMTP(email_host, email_port) as server:
            server.starttls()
            server.login(email_user, email_pass)
            server.sendmail(email_user, msg['To'], msg.as_string())
            print("Email sent successfully!")
    except Exception as e:
        print(f"Error sending email: {str(e)}")



def serialize(data):
    """Recursively convert datetime, Decimal, and other non-serializable types in a dictionary to strings or floats."""
    if isinstance(data, dict):
        return {key: serialize(value) for key, value in data.items()}
    elif isinstance(data, list):
        return [serialize(item) for item in data]
    elif isinstance(data, datetime):
        return data.isoformat()  # Convert datetime to ISO format
    elif isinstance(data, Decimal):
        return float(data)  # Convert Decimal to float
    return data

@router.get("/admin/getdata/")
async def getdata(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        # Fetch data from each table
        cursor.execute("SELECT * FROM video_purchases")
        purchases = cursor.fetchall()

        cursor.execute("SELECT * FROM final_videos")
        finalVideos = cursor.fetchall()

        for video in finalVideos:
            video['final_video_path'] = os.path.basename(video['final_video_path'])

        cursor.execute("SELECT * FROM payments")
        payments = cursor.fetchall()

        cursor.execute("SELECT * FROM early_access")
        coupons = cursor.fetchall()

        # Serialize all fetched data
        response_data = {
            "purchases": serialize(purchases),
            "finalVideos": serialize(finalVideos),
            "payments": serialize(payments),
            "coupons": serialize(coupons)
        }

        return JSONResponse(content=response_data)
    
    except Exception as e:
        print(f"Error fetching data: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching data.")
    finally:
        cursor.close()


@router.get("/admin/send-video/")
async def get_send_video(id: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM final_videos WHERE id = %s",(id,))
        finalVideo = cursor.fetchall()

        cursor.execute("SELECT * FROM video_purchases WHERE id = %s",(finalVideo[1],))
        purchase_data = cursor.fetchall()

        if purchase_data[17] != 'null':
            for email in purchase_data[17]:
                send_on_email(email, finalVideo[2])
            data = {
                'message':'Successfully sent mail'
            }
        else:
            data = {
                'message':'email is not available'
            }

        return JSONResponse(content=data)
    except Exception as e:
        print(f"Error fetching video purchases: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching video purchases.")
    finally:
        cursor.close()




@router.post("/admin/add-coupon/")
async def create_coupon(code: str = Form(...), total_number: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("INSERT INTO early_access (coupon, total_number) VALUES (%s, %s)", (code, total_number))
        db.commit()
        return JSONResponse(status_code=200, content={"message": "Coupon created successfully."})
    except Exception as e:
        print(f"Error creating coupon: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the coupon.")
    finally:
        cursor.close()


# Endpoint to retrieve all coupons
@router.get("/admin/coupons/")
async def get_coupons(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM coupons")
        coupons = cursor.fetchall()
        return JSONResponse(content=coupons)
    except Exception as e:
        print(f"Error fetching coupons: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching coupons.")
    finally:
        cursor.close()

        

@router.post("/admin/del-coupon/")
async def delete_coupon(id: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM early_access WHERE id = %s", (id,))
        db.commit()
        return JSONResponse(status_code=200)  # No content
    except Exception as e:
        print(f"Error deleting coupon: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the coupon.")
    finally:
        cursor.close()



@router.post("/admin/add-email/")
async def store_email(email: str = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        # Insert the email into the newsletter table
        cursor.execute("INSERT INTO newsletter (email) VALUES (%s)", (email,))
        db.commit()
        return JSONResponse(status_code=200, content={"message": "Email added successfully to newsletter."})
    except Exception as e:
        print(f"Error storing email: {e}")
        db.rollback()  # Rollback the transaction if any error occurs
        raise HTTPException(status_code=500, detail="An error occurred while adding the email.")
    finally:
        cursor.close()







