from django.shortcuts import render
from django.contrib.auth.models import User, Group
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL
from corona_tweet_analysis.models import TwitterData
from corona_tweet_analysis import serializers
from rest_framework import viewsets, generics, permissions
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer


class CategoryDataViewset(viewsets.ModelViewSet):
    queryset = TwitterData.objects.all()
    serializer_class = serializers.CategorySerializer

class TwitterDataView(generics.ListAPIView):
    def get(self, request, **kwargs):
        try:
            tweets = TwitterData.objects(category="INFECTED").limit(10)
            data = []
            for i in tweets:
                data.append({"text": i.text,
                             "category": i.category})
            return send_response({'status': SUCCESS, 'data': data})
        except Exception as err:
            print(err)
            return send_response({'status': FAIL})


class TwitterDataViewManager(BaseViewManager):
    VIEWS_BY_METHOD = {
        'GET': TwitterDataView.as_view
    }