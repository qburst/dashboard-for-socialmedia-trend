from django.shortcuts import render
from django.contrib.auth.models import User, Group
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS
from corona_tweet_analysis.models import TwitterData, Category
from corona_tweet_analysis import serializers
from rest_framework import generics, permissions
from rest_framework_mongoengine import viewsets, generics
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer

class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer

class SpamCountView(generics.ListCreateAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer

    def put(self, request, *args, **kwargs):
        tweet_id = request.query_params.get('tweet_id')
        if not tweet_id:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Tweet id is required'})
        tweet = TwitterData.objects(id=tweet_id)
        if not tweet:
            return send_response({'status': FAIL, 'message':'Tweet not found'})
        print("TWEEEEEEET", tweet)
        spam_count = tweet[0].spam_count + 1
        tweet[0].update(spam_count=spam_count)
        return send_response({'status': SUCCESS, 'data': 'Spam count updated'})