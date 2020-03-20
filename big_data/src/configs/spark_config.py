
from pyspark import SparkContext
from pyspark.streaming import StreamingContext

from settings import default

sc = SparkContext("local[2]", "Twitter Demo")
ssc = StreamingContext(sc, 10)  # 10 is the batch interval in seconds
IP = "localhost"
Port = 5555