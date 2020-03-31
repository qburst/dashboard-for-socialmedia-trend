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

from utils.utils import getMandatoryHashtags, getCategories

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
            tweet.url = "https://twitter.com/user/status/" + data.get("id_str")
            tweet.save()
            db_client.close()

def filterHash(hashtags):
    for hashtag in hashtags:
        if hashtag.get("text") in getMandatoryHashtags():
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
    category_list = []
    categories = getCategories()
    for category in categories:
        category_list += processCategory(category['keywords'].split(), text, category["category"])

    if len(category_list) == 0:
        category_list.append("--NA--")

    return category_list


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
