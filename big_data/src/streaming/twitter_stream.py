from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener
import socket
import sys
from os import path

class TweetsListener(StreamListener):

    def __init__(self, csocket):
        self.client_socket = csocket

    def on_data(self, data):
        try:
            print(data.split('\n'))
            self.client_socket.send(bytes(data, "utf-8"))
            return True
        except BaseException as e:
            print("Error on_data: %s" % str(e))
            raise e
        # return True

    def on_error(self, status):
        print(status)
        return True


def sendData(c_socket):
    auth = OAuthHandler(stream_source_config.consumer_key, stream_source_config.consumer_secret)
    auth.set_access_token(stream_source_config.access_token, stream_source_config.access_secret)

    twitter_stream = Stream(auth, TweetsListener(c_socket))
    covidtags = ['COVID19,coronavirus,Corona,CoronaVirusUpdate,coronavirusindia']
    try:
        twitter_stream.filter(track=covidtags)
    except KeyboardInterrupt as e:
        print("Stopping excecution")
    except BaseException as e:
        print("Error occurred: %s" % str(e))
        sendData(c_socket)

if __name__ == "__main__":
    sys.path.append(path.join(path.dirname(__file__), '..'))
    from configs import stream_source_config
    s = socket.socket()  # Create a socket object
    host = "localhost"  # Get local machine name
    port = 5555  # Reserve a port for your service.
    s.bind((host, port))  # Bind to the port

    print("Listening on port: %s" % str(port))

    s.listen(5)  # Now wait for client connection.
    c, addr = s.accept()  # Establish connection with client.

    print("Received request from: " + str(addr))

    sendData(c)