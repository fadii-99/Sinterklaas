import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# MySQL database connection configuration
mysql_config = {
    'host': 'localhost',
    'user': 'user1',
    'password': '1234',
    'database': 'sintmagie'
}
# mysql_config = {
#     'host': 'localhost',
#     'user': 'root',
#     'password': '',
#     'database': 'sinterklaas'
# }

# Create a connection to the database
def get_db():
    connection = mysql.connector.connect(**mysql_config)
    try:
        yield connection  # Provide the connection for use in FastAPI endpoints
    finally:
        connection.close()


def get_db_connection():
    return mysql.connector.connect(**mysql_config)