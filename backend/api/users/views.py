from . import serializers
from django.contrib.auth import logout, login

from rest_framework import views
from rest_framework import viewsets, views
from rest_framework.response import Response
from users import models
from rest_framework.authentication import TokenAuthentication
from users import permissions
from rest_framework import filters
from rest_framework.authtoken.views import ObtainAuthToken, Token
from rest_framework.settings import api_settings
from rest_framework.permissions import IsAuthenticated


class UserProfileViewset(viewsets.ModelViewSet):
    """Handle creating and updating view sets"""
    serializer_class = serializers.UserProfileSerializer
    queryset = models.UserProfile.objects.all()
    authentication_classes = (TokenAuthentication,)
    permission_classes = (permissions.UpdateOwnProfile,)
    filter_backends = (filters.SearchFilter,)
    http_method_names = ['post']
    search_fields = ('name', 'email',)


class UserLoginApiView(ObtainAuthToken):
    """Handle creating user authentication tokens"""
    renderer_classes = api_settings.DEFAULT_RENDERER_CLASSES

    def post(self, request, *args, **kwargs):
        serializer = self.serializer_class(data=request.data,
                                           context={'request': request})
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']
        login(request, user)
        token, created = Token.objects.get_or_create(user=user)
        return Response({'token': token.key})


class LogoutView(views.APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        logout(request)
        return Response("Logged Out Successfully")
