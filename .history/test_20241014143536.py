# Download the helper library from https://www.twilio.com/docs/python/install
import os
from twilio.rest import Client

# Find your Account SID and Auth Token at twilio.com/console
# and set the environment variables. See http://twil.io/secure
account_sid = 'ACfad9e57380aeac399e1f75b7a8622983'
auth_token = '0e30b63404b1d238611b99e0b91f8225'
client = Client(account_sid, auth_token)

message = client.messages.create(
    to="whatsapp:+15005550006",
    from_="whatsapp:+14155238886",
    body="Hello there!",
)

print(message.body)