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
        countries = TwitterData.objects(country__ne='--NA--').distinct('country')
        country_recovery_list= []
        for country in countries:
            recovered_count = TwitterData.objects(category='RECOVRED').count()
            country_recovery_list.append({country:recovered_count})
        if not tweet:
            return send_response({'status': FAIL, 'message':'Tweet not found'})
        print("TWEEEEEEET", countries, country_recovery_list)
        spam_count = tweet[0].spam_count + 1
        tweet[0].update(spam_count=spam_count)
        return send_response({'status': SUCCESS, 'data': 'Spam count updated'})

class StatisticsView(generics.ListCreateAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer

    def get(self, request, *args, **kwargs):       
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