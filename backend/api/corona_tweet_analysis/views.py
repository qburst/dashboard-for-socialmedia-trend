import mongoengine
from django.shortcuts import render
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS, BAD_REQUEST, UNAUTHORIZED
from corona_tweet_analysis.models import TwitterData, Category, CoronaReport
from corona_tweet_analysis import serializers
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, generics
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer, CoronaReportSerializer

class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CoronaReportView(generics.ListAPIView):
    queryset = CoronaReport.objects.order_by('-created_at').limit(1)
    serializer_class = CoronaReportSerializer


class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects(is_spam__ne=True).order_by('-created_at', '-id')
    serializer_class = TwitterDataSerializer

    def get(self, request, *args, **kwargs):
        category = request.query_params.get('category')
        if category:
            category_obj = Category.objects(_id=category).first()
            if not category_obj:
                return send_response({'status': INVALID_PARAMETERS, 'message':'Category not found'})
            else:
                self.queryset = self.queryset(category=category).order_by('-created_at', '-id')
        return super().get(request, *args, **kwargs)


class SpamCountView(generics.ListCreateAPIView):
    queryset = TwitterData.objects.all()
    serializer_class = TwitterDataSerializer
    authentication_classes = (TokenAuthentication,)
    permission_classes = [permissions.IsAuthenticated]

    def put(self, request, *args, **kwargs):
        try:
            tweet_id = request.query_params.get('tweet_id')
            if not tweet_id:
                return send_response({'status': INVALID_PARAMETERS, 'message':'Tweet id is required'})
            tweet = TwitterData.objects(id=tweet_id).first()
            if not tweet:
                return send_response({'status': FAIL, 'message':'Tweet not found'})   

            # Handling spam tweets 
            spam_users = tweet.spam_users
            spam_count = tweet.spam_count
            if request.user.email not in spam_users:
                spam_users.append(request.user.email)
                spam_count = tweet.spam_count + 1
            
            if len(spam_users) > 10 or request.user.is_superuser:
                tweet.update(spam_count=spam_count, is_spam=True, spam_users=spam_users)
                return send_response({'status': SUCCESS, 'data': 'Spam count updated'})
            return send_response({'status': BAD_REQUEST, 'data': 'You have already mark this as spam'})
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
