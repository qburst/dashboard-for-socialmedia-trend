from rest_framework.response import Response
from rest_framework import status

from api.utils.constants import SUCCESS, UNAUTHORIZED


def send_response(data):
    if data['status'] == SUCCESS:
        return Response(data, status=status.HTTP_200_OK)
    elif data['status'] == UNAUTHORIZED:
        return Response(data, status=status.HTTP_401_UNAUTHORIZED)
    else:
        return Response(data, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
