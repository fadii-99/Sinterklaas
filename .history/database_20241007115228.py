import mysql.connector
import os
from dotenv import load_dotenv

load_dotenv()

# MySQL database connection configuration
mysql_config = os.getenv('mysql_config')

# Create a connection to the database
def get_db():
    try:
        connection = mysql.connector.connect(**mysql_config)
        yield connection
    finally:
        connection.close()
