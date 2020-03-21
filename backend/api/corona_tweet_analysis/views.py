from django.shortcuts import render
from django.contrib.auth.models import User, Group
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL
from corona_tweet_analysis.models import TwitterData, Category
from corona_tweet_analysis import serializers
from rest_framework import generics, permissions
from rest_framework_mongoengine import viewsets, generics
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer

from rest_framework_mongoengine import viewsets

class CategoryViewset(viewsets.ModelViewSet):
    '''
    Retrieve all categories
    '''
    serializer_class = CategorySerializer

    def get_queryset(self):
        return Category.objects.all()


class TwitterDataViewset(viewsets.ModelViewSet):
    '''
    Retrieve all tweets
    '''
    serializer_class = TwitterDataSerializer

    def get_queryset(self):
        return TwitterData.objects.all()


class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer
    # def get(self, request, **kwargs):
    #     try:
    #         tweets = TwitterData.objects.limit(10)
    #         data = []
    #         for i in tweets:
    #             data.append({"text": i.text,
    #                          "category": i.category})
    #         return send_response({'status': SUCCESS, 'data': data})
    #     except Exception as err:
    #         print(err)
    #         return send_response({'status': FAIL})


# class TwitterDataViewManager(BaseViewManager):
#     VIEWS_BY_METHOD = {
#         'GET': TwitterDataView.as_view
#     }