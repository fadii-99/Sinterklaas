from twilio.rest import Client
account_sid = 'ACfad9e57380aeac399e1f75b7a8622983'
auth_token = '0e30b63404b1d238611b99e0b91f8225'
client = Client(account_sid, auth_token)
message = client.messages.create(
    to='+18777804236'
)
print(message.sid)
## Create Sender
# curl -X "POST" "https://messaging.twilio.com/v2/Channels/Senders" \
#   -H "Content-Type: application/json; charset=utf-8" \
#   -u "ACfad9e57380aeac399e1f75b7a8622983:0e30b63404b1d238611b99e0b91f8225" \
#   -d $'{
#   "sender_id": "whatsapp:+3197010259010",
#   "profile": {
#     "address": "101 Spear Street, San Francisco, CA",
#     "emails": [
#       "support@twilio.com"
#     ],
#     "vertical": "Other",
#     "logo_url": "https://www.twilio.com/logo.png",
#     "description": "We\'re excited to see what you build!",
#     "about": "Hello! We are Twilio.",
#     "name": "Twilio",
#     "websites": [
#       "https://twilio.com",
#       "https://help.twilio.com"
#     ]
#   },
#   "webhook": {
#     "callback_method": "POST",
#     "callback_url": "https://demo.twilio.com/welcome/sms/reply/"
#   }
# }'