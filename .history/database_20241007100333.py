import mysql.connector

mysql_config = {
    'host': 'localhost',
    'user': 'root',
    'password': '',
    'database': 'sinterklaas'
}

connection = mysql.connector.connect(**mysql_config)
