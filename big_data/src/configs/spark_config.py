from pyspark.sql import SparkSession

from settings import default


spark = SparkSession.builder \
    .appName("Twitter Demo") \
    .master("local[2]") \
    .getOrCreate()

IP = "localhost"
Port = 5555
