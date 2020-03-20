from pycountry import countries

DB_NAME = 'streamdb'

KEYWORDS = ['infected', 'recovered', 'infect', 'recover', 'death', 'died', 'cases', 'case', 'toll', 'cure',
            'vaccine', 'travel history', 'tested positive', 'tested negative', 'positive', 'negative']

COUNTRIES = [country.name.lower() for country in list(countries)]
CATEGORIES = ['INFECTED', 'RECOVERED', 'DEATH', 'POSITIVE', 'NEGATIVE', 'TRAVEL_HISTORY']

INFECTED_KEYWORDS = ['infected', 'infect', 'tested positive']
RECOVERED_KEYWORDS = ['recover', 'recovered', 'tested negative']
DEATH_KEYWORDS = ['death toll', 'died', 'deaths', 'death']

MANDATORY_HASHTAGS = ['COVID19', 'coronavirus', 'Corona', 'CoronaVirusUpdate']



