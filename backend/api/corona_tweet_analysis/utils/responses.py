from rest_framework.response import Response
from rest_framework import status

from corona_tweet_analysis.utils.constants import SUCCESS, UNAUTHORIZED, BAD_REQUEST


def send_response(data):
    if data['status'] == SUCCESS:
        return Response(data, status=status.HTTP_200_OK)
    elif data['status'] == UNAUTHORIZED:
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    elif data['status'] == BAD_REQUEST:
        return Response(data, status=status.HTTP_400_BAD_REQUEST)
    else:
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
