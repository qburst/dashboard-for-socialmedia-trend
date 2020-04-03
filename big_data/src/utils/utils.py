from pymongo import MongoClient
from utils import constants

client = MongoClient('localhost', 27017)
db = client[constants.DB_NAME]


def getMandatoryHashtags():
    hashtags = db.corona_tweet_analysis_hashtag
    hashtags_list = [hashtag["hashtag"] for hashtag in hashtags.find({"approved": True}, {"_id": 0, "hashtag": 1})]
    return hashtags_list


def getCategories():
    categories = db.corona_tweet_analysis_category
    categories_list = [category for category in categories.find({"approved": True},
                                                                {'_id': 0, 'category': 1, 'keywords': 1})]
    return categories_list


def getAllKeywords():
    categories = db.corona_tweet_analysis_category
    keywords = []
    for category in categories.find({"approved": True}, {'_id': 0, 'category': 1, 'keywords': 1}):
        keywords += category["keywords"].split(',')
    return keywords
