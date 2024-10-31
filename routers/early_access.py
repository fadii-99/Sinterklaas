from fastapi import FastAPI, Depends, HTTPException, APIRouter
from schemas import EarlyAccessSchema  
from database import get_db
from utils import send_email

router = APIRouter()

@router.post("/earlyaccess/")
def add_early_access(data: EarlyAccessSchema, db=Depends(get_db)):
    cursor = db.cursor()
    
    cursor.execute("SELECT email FROM early_access WHERE email = %s", (data.email,))
    existing_email = cursor.fetchone()
    
    if existing_email:
        return {"message": "This email is already on the early access list."}
    
    trimmed_email = data.email.replace('@gmail.com', '')

    # Construct the coupon
    coupon = "EARLY-ACCESS-" + trimmed_email
    
    cursor.execute("INSERT INTO early_access (email, coupon) VALUES (%s, %s)", (data.email, coupon))
    db.commit()
    cursor.close()

    html_body = f"""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Binnenkort Beschikbaar - Sinterklaas</title>
                <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap" rel="stylesheet">
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
                <div style="max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);">
                    <div style="background-color: #B22222; padding: 20px; text-align: center;">
                        <h1 style="color: #ffffff; margin: 0;">SintMagie komt binnenkort!</h1>
                    </div>
                    <div style="padding: 20px; text-align: center;">
                        <p style="color: #555555; line-height: 1.5;">Bedankt voor je inschrijving om vroegtijdige toegang te krijgen. We zijn enthousiast om binnenkort de magie van Sinterklaas naar jou te brengen!</p>
                        <p style="color: #555555; line-height: 1.5;">Als blijk van onze waardering, hier is jouw exclusieve vroegboekingscouponcode:</p>
                        <div style="margin: 20px 0; padding: 15px; background-color: #FFD700; border-radius: 5px; display: inline-block;">
                            <p style="font-family: 'Roboto', sans-serif; font-size: 24px; color: #B22222; margin: 0; font-weight: bold;">{coupon}</p>
                        </div>
                        <div style="margin: 20px 0;">
                            <a href="http://www.sintmagie.nl/" style="background-color: #B22222; color: #ffffff; text-decoration: none; padding: 15px 30px; border-radius: 5px; font-size: 16px;">Bezoek onze website</a>
                        </div>
                    </div>
                    <div style="background-color: #B22222; padding: 10px; text-align: center; color: #ffffff;">
                        <p style="margin: 0;">Volg ons op:</p>
                        <p style="margin: 5px 0;">
                            <a href="https://facebook.com" style="color: #ffffff; margin: 0 5px;">Facebook</a> | 
                            <a href="https://twitter.com" style="color: #ffffff; margin: 0 5px;">Twitter</a> | 
                            <a href="https://instagram.com" style="color: #ffffff; margin: 0 5px;">Instagram</a>
                        </p>
                        <p style="margin: 0; font-size: 12px;">Je ontvangt deze e-mail omdat je je hebt ingeschreven voor onze vroege toegang lijst.</p>
                    </div>
                </div>
            </body>
            </html>
            """

    send_email(data.email, 'Coming Soon', html_body)
    
    return {"message": "You have been added to the early access list!"}
