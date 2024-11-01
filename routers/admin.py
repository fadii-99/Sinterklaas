from fastapi import FastAPI, Depends, HTTPException, APIRouter, Form
from schemas import EarlyAccessSchema  
from database import get_db
from utils import send_email


router = APIRouter()



@router.get("/admin/video-purchases/")
async def get_video_purchases(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM video_purchases")
        purchases = cursor.fetchall()
        return JSONResponse(content=purchases)
    except Exception as e:
        print(f"Error fetching video purchases: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching video purchases.")
    finally:
        cursor.close()


@router.post("/admin/video-purchase/delete")
async def delete_video_purchase(id: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM video_purchases WHERE id = %s", (id,))
        db.commit()

        return JSONResponse(status_code=204, content={"message": "Video purchase deleted successfully."})

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




@router.get("/admin/generated-videos/")
async def get_generated_videos(db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM final_videos")
        finalVideos = cursor.fetchall()
        return JSONResponse(content=finalVideos)
    except Exception as e:
        print(f"Error fetching video purchases: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while fetching video purchases.")
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








@router.post("/admin/coupons/")
async def create_coupon(code: str = Form(...), total_number: int = Form(...), db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("INSERT INTO early_access (coupon, total_number) VALUES (%s, %s)", (code, total_number))
        db.commit()
        return JSONResponse(status_code=201, content={"message": "Coupon created successfully."})
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

        

@router.delete("/admin/coupons/")
async def delete_coupon(id: int, db=Depends(get_db)):
    cursor = db.cursor(dictionary=True)
    try:
        cursor.execute("DELETE FROM early_access WHERE id = %s", (id,))
        db.commit()
        return JSONResponse(status_code=204, content={"message": "Coupon deleted successfully."})
    except Exception as e:
        print(f"Error deleting coupon: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while deleting the coupon.")
    finally:
        cursor.close()