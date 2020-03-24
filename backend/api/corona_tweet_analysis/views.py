import mongoengine
from django.shortcuts import render
from django.contrib.auth.models import User, Group
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS, BAD_REQUEST
from corona_tweet_analysis.models import TwitterData, Category
from corona_tweet_analysis import serializers
from rest_framework import generics, permissions
from rest_framework_mongoengine import viewsets, generics
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer
from rest_framework.authentication import TokenAuthentication
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer
# from users import permissions

class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):     
        try:  
            print(request.user, request.user.is_authenticated)
            tweets = TwitterData.objects.all()
            category = request.query_params.get('category')
            if category:
                category_obj = Category.objects(_id=category).first()
                if not category_obj:
                    return send_response({'status': INVALID_PARAMETERS, 'message':'Category not found'})
                tweets = tweets(category=category)            
            serializer = self.serializer_class(tweets, many=True) 
            if serializer.is_valid:
                return send_response({'status': SUCCESS, 'data': serializer.data})
            return send_response({'status': BAD_REQUEST})
        except Exception as err:
            return send_response({'status': FAIL})


class SpamCountView(generics.ListCreateAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer

    def put(self, request, *args, **kwargs):
        try:
            # user = authenticate(username=request.user.username, password=request.user.password)
            # assert isinstance(user, mongoengine.django.auth.User)
            tweet_id = request.query_params.get('tweet_id')
            if not tweet_id:
                return send_response({'status': INVALID_PARAMETERS, 'message':'Tweet id is required'})
            tweet = TwitterData.objects(id=tweet_id).first()
            countries = TwitterData.objects(country__ne='--NA--').distinct('country')
            country_recovery_list= []
            for country in countries:
                recovered_count = TwitterData.objects(category='RECOVRED').count()
                country_recovery_list.append({country:recovered_count})
            if not tweet:
                return send_response({'status': FAIL, 'message':'Tweet not found'})
            spam_count = tweet.spam_count + 1
            is_spam = False
            if spam_count > 10:
                is_spam = True
            tweet.update(spam_count=spam_count, is_spam=is_spam)
            return send_response({'status': SUCCESS, 'data': 'Spam count updated'})
        except Exception as err:
            return send_response({'status': FAIL})


class StatisticsView(generics.ListCreateAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer

    def get(self, request, *args, **kwargs):  
        try:     
            statistics_dict = {}
            country_confirmed_dict = {}
            # get the number of infected cases for eah country
            countries = TwitterData.objects(country__ne='--NA--').distinct('country')
            for country in countries:
                recovered_count = TwitterData.objects(category='INFECTED', country=country).count()  
                country_confirmed_dict[country] = recovered_count
            
            # Calculate the number of infected cases, deaths and recovery cases based on category
            infected_count = TwitterData.objects(category='INFECTED').count()
            death_count = TwitterData.objects(category='DEATH').count()
            recovered_count = TwitterData.objects(category='RECOVERED').count()

            statistics_dict['country_confirmed_cases'] = country_confirmed_dict
            statistics_dict['infected_count'] = infected_count
            statistics_dict['death_count'] = death_count
            statistics_dict['recovered_count'] = recovered_count
            
            return send_response({'status': SUCCESS, 'data': statistics_dict})
        except Exception as err:
            return send_response({'status': FAIL})
