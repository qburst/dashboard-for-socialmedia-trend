from pycountry import countries
# Messages
SUCCESS = 'success'
FAIL = 'fail'
UNAUTHORIZED = 'unauthorized'
INVALID_PARAMETERS = 'invalid parameters'
BAD_REQUEST = 'bad_request'

COUNTRIES = [country.name.lower() for country in list(countries)] + ['usa', 'worldwide']
