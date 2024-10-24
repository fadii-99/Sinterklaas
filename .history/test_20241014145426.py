from twilio.rest import Client


account_sid = 'ACfad9e57380aeac399e1f75b7a8622983'
auth_token = '0e30b63404b1d238611b99e0b91f8225'
client = Client(account_sid, auth_token)

message = client.messages.create(
    to="whatsapp:+923480952114",
    from_="whatsapp:+3197010259010",
    body="Hello there!",
)

print(message.body)