import time
import sys
from json import loads
from os import path
from mongoengine import connect

from database_models.mongo_models import TwitterData, Category
from configs import spark_config
from utils.constants import KEYWORDS, MANDATORY_HASHTAGS, \
    CATEGORIES, COUNTRIES, DB_NAME, INFECTED_KEYWORDS, RECOVERED_KEYWORDS, \
    DEATH_KEYWORDS, TRAVEL_HISTORY_KEYWORDS, VACCINE_KEYWORDS, CURE_KEYWORDS, USERNAME, \
    PASSWORD, HOST

def saveMongo(data):
    data = loads(data.asDict()['value'])
    text = data.get("text", '--NA--')
    print("Processing data from user:"+data.get('user',{}).get('name', '--NA--'))
    if not text.startswith("RT @") and filterKeyword(text) and "retweeted_status" not in data.keys() and text != '--NA--':
        hashtags = data.get('entities', {}).get('hashtags', [])
        if filterHash(hashtags):
                db_client = connect(
                db=DB_NAME
                # host='mongodb+srv://' + USERNAME + ':' + PASSWORD + '@' + HOST + '/' + DB_NAME + '?retryWrites=true&w=majority'
            )
            categories = getCategory(text)
            cat_objs = Category.objects.in_bulk(categories)
            for cat_name in list(set(categories) - set(cat_objs)):
                category = Category(_id = cat_name)
                category.save()

            
            tweet = TwitterData(text=text)
            tweet.hashtags = [hashtag["text"] for hashtag in hashtags]
            tweet.user = data.get('user')
            tweet.country = getCountry(text)
            tweet.category = categories
            tweet.save()
            db_client.close()

def filterHash(hashtags):
    for hashtag in hashtags:
        if hashtag.get("text") in MANDATORY_HASHTAGS:
            return True
    return False


def filterKeyword(text):
    for keyword in KEYWORDS:
        if keyword in text.lower():
            return True
    return False


def getCountry(text):
    countries = []
    for country in COUNTRIES:
        if country in text.lower():
            countries.append(country)
    if len(countries) == 0:
        countries.append("--NA--")
    return countries


def getCategory(text):
    category = []
    category += processCategory(INFECTED_KEYWORDS, text, "INFECTED")
    category += processCategory(DEATH_KEYWORDS, text, "DEATH")
    category += processCategory(RECOVERED_KEYWORDS, text, "RECOVERED")
    category += processCategory(TRAVEL_HISTORY_KEYWORDS, text, "TRAVEL_HISTORY")
    category += processCategory(VACCINE_KEYWORDS, text, "VACCINE")
    category += processCategory(CURE_KEYWORDS, text, "CURE")

    if len(category) == 0:
        category.append("--NA--")

    return category


def processCategory(keywords, text, category):
    for keyword in keywords:
        if keyword in text.lower():
            return [category]
    return []


if __name__ == "__main__":
    sys.path.append(path.join(path.dirname(__file__), '..'))
    df = spark_config.spark \
            .readStream \
            .format("socket") \
            .option("host", spark_config.IP) \
            .option("port", spark_config.Port) \
            .load()
    transform = df.writeStream\
            .foreach(saveMongo)\
            .start()

    transform.awaitTermination()
