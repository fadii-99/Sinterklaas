import smtplib

def send_email(to_email: str, subject: str, body: str):
    try:
        server = smtplib.SMTP('smtp.your-email-provider.com', 587)
        server.starttls()
        server.login('your-email@example.com', 'your-password')
        message = f'Subject: {subject}\n\n{body}'
        server.sendmail('your-email@example.com', to_email, message)
        server.quit()
        return True
    except Exception as e:
        print(f"Failed to send email to {to_email}: {e}")
        return False

def start_background_task():
    print("Background task started")
    # Your background task logic
