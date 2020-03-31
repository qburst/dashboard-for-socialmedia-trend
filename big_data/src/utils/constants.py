from pycountry import countries

# DB constants
DB_NAME = "streamdb"
HOST = "dap-cluster-uteti.mongodb.net"
USERNAME = "big_data"
PASSWORD = "bigdatapassword"


COUNTRIES = [country.name.lower() for country in list(countries)] + ['usa', 'worldwide']
