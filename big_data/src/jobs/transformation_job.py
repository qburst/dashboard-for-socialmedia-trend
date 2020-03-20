import json
from pyspark.sql import SparkSession


# Our transformation function:
def process_tweets(tweet):

    json_tweet = json.loads(tweet)
    print(json_tweet)
    spark = SparkSession.builder.getOrCreate()
    data_rdd = spark.read.json(json_tweet).rdd
    transformed_data = transformfunc(data_rdd)
    return transformed_data

def transformfunc(res):

    return [{"user": result.get('user', {})['name'], "location": result.get('user', {})['location'], "text": result.get("text")} for result in [row.asDict() for row in res.collect()] if result.get('user')]

def getSparkSessionInstance(sparkConf):
    if ('sparkSessionSingletonInstance' not in globals()):
        globals()['sparkSessionSingletonInstance'] = SparkSession\
            .builder\
            .config(conf=sparkConf)\
            .getOrCreate()
    return globals()['sparkSessionSingletonInstance']