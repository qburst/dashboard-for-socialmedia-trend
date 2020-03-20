from pycountry import countries

DB_NAME = 'streamdb3'


COUNTRIES = [country.name.lower() for country in list(countries)] + ['US', 'UK', 'SA', 'USA']
CATEGORIES = ['INFECTED', 'RECOVERED', 'DEATH', 'POSITIVE', 'NEGATIVE', 'TRAVEL_HISTORY']

INFECTED_KEYWORDS = ['infected', 'infect', 'tested positive', 'confirmed']
RECOVERED_KEYWORDS = ['recover', 'recovered', 'tested negative']
DEATH_KEYWORDS = ['death toll', 'died', 'deaths', 'death']
TRAVEL_HISTORY_KEYWORDS = ['travel history']
SUPPLY_KEYWORDS = []

KEYWORDS = INFECTED_KEYWORDS + RECOVERED_KEYWORDS + DEATH_KEYWORDS + TRAVEL_HISTORY_KEYWORDS

MANDATORY_HASHTAGS = ['COVID19', 'coronavirus', 'Corona', 'CoronaVirusUpdate']
