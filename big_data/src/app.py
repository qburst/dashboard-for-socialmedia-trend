import time
import sys
from datetime import datetime
from json import loads
from os import path
from mongoengine import DynamicDocument, StringField, connect, DateTimeField

from configs import spark_config
from utils.constants import KEYWORDS, MANDATORY_HASHTAGS, \
    CATEGORIES, COUNTRIES, DB_NAME, INFECTED_KEYWORDS, RECOVERED_KEYWORDS, \
    DEATH_KEYWORDS


class TwitterData(DynamicDocument):
    text = StringField(required=True, max_length=200)
    created_at = DateTimeField(default=datetime.utcnow())
    meta = {'allow_inheritance': True}

def saveMongo(data):
    data = loads(data)
    text = data.get('text', '--NA--')

    if not text.startswith("RT @") and filterKeyword(text) and "retweeted_status" not in data.keys():
        hashtags = data.get('entities', {}).get('hashtags', [])
        if filterHash(hashtags):
            connect(DB_NAME)
            tweet = TwitterData(text=text)
            tweet.hashtags = hashtags
            tweet.user = data.get('user')
            tweet.country = getCountry(text)
            tweet.category = getCategory(text)
            tweet.save()


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
    for country in COUNTRIES:
        if country in text.lower():
            return country
    return "--NA--"


def getCategory(text):
    category = []
    for keyword in INFECTED_KEYWORDS:
        if keyword in text.lower():
            category.append("INFECTED")
            break
    for keyword in DEATH_KEYWORDS:
        if keyword in text.lower():
            category.append("DEATH")
            break

    for keyword in RECOVERED_KEYWORDS:
        if keyword in text.lower():
            category.append("RECOVERED")
            break

    if len(category) == 0:
        category.append("--NA--")

    return category


if __name__ == "__main__":
    sys.path.append(path.join(path.dirname(__file__), '..'))
    ssc = spark_config.ssc
    lines = ssc.socketTextStream(spark_config.IP, spark_config.Port)

    lines.foreachRDD(lambda rdd: rdd.filter(saveMongo).coalesce(1).saveAsTextFile("./tweets/%f" % time.time()))

    ssc.start()
    ssc.awaitTermination()