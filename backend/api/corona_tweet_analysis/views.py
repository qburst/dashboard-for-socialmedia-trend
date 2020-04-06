import mongoengine
from json import loads, dumps
from django.shortcuts import render
from django.core.exceptions import PermissionDenied
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS, BAD_REQUEST, UNAUTHORIZED
from corona_tweet_analysis.models import TwitterData, Category, CoronaReport, Data
from corona_tweet_analysis import serializers
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, generics
from rest_framework.response import Response
from rest_framework.decorators import permission_classes
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer

class CoronaWorldReportView(generics.ListCreateAPIView):
    http_method_names = ['get', 'put']

    def get(self, request, *args, **kwargs):
        corona_report = CoronaReport.objects.order_by('-created_at').first()
        data = loads(corona_report.to_json())
        world = {}
        for country in data['data']:
            if country['name'] == "World":
                world = country
        return Response({
            'status': SUCCESS,
            'data': world,
            'created_at': corona_report.created_at
        })

    def put(self, request, *args, **kwargs):
        permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]
        if request.user.is_authenticated == False or request.user.is_superuser == False:
            raise PermissionDenied

        corona_report = CoronaReport.objects.order_by('-created_at').first()
        new_cases = request.query_params.get('new_cases')
        new_deaths = request.query_params.get('new_deaths')
        total_deaths = request.query_params.get('total_deaths')
        total_cases = request.query_params.get('total_cases')

        if not (new_cases or new_deaths or total_deaths or total_cases):
            return send_response({'status': SUCCESS, 'message':'No update values were given'})

        report_data = loads(corona_report.to_json())
        data_objects_list = []
        for data in report_data['data']:
            if data['name'] == 'World':                
                data['new_cases'] =  int(new_cases) if new_cases else data['new_cases']
                data['new_deaths'] = int(new_deaths) if new_deaths else data['new_deaths']
                data['total_deaths'] = int(total_deaths) if total_deaths else data['total_deaths']
                data['total_cases'] = int(total_cases) if total_cases else data['total_cases']
                
            data_obj = Data(name=data['name'], new_cases=data['new_cases'], new_deaths=data['new_deaths'], 
                total_deaths=data['total_deaths'], total_cases=data['total_cases'])
            data_objects_list.append(data_obj)

            new_report = CoronaReport(data=data_objects_list)
            new_report.save()
        return send_response({'status': SUCCESS, 'message':'Corona Report updated'})        
    
class CoronaReportView(generics.ListCreateAPIView):
    http_method_names = ['get', 'put']

    def get(self, request, *args, **kwargs):
        country = request.query_params.get('country')
        if not country:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Country not sent'})

        country_data_report = CoronaReport.objects(data__name=country).order_by('-created_at').first()
        if not country_data_report:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Country not found'})

        corona_report = CoronaReport.objects.order_by('-created_at').first()
        report_data = loads(corona_report.to_json())
        created_at = report_data['created_at']
        data = {}
        for country_data in report_data['data']:
            if country_data['name'] == country:
                data = country_data
            
        return Response({
            'status': SUCCESS,
            'data': data,
            'created_at': corona_report.created_at
        })
    
    def put(self, request, *args, **kwargs):
        permission_classes = [permissions.IsAdminUser, permissions.IsAuthenticated]
        if request.user.is_authenticated == False or request.user.is_superuser == False:
            raise PermissionDenied

        country = request.query_params.get('country')
        if not country:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Country not sent'})

        country_data_report = CoronaReport.objects(data__name=country).order_by('-created_at').first()
        if not country_data_report:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Country not found'})


        corona_report = CoronaReport.objects.order_by('-created_at').first()
        new_cases = request.query_params.get('new_cases')
        new_deaths = request.query_params.get('new_deaths')
        total_deaths = request.query_params.get('total_deaths')
        total_cases = request.query_params.get('total_cases')

        if not (new_cases or new_deaths or total_deaths or total_cases):
            return send_response({'status': SUCCESS, 'message':'No update values were given'})

        report_data = loads(corona_report.to_json())
        data_objects_list = []
        for data in report_data['data']:
            if data['name'] == country:                
                data['new_cases'] =  int(new_cases) if new_cases else data['new_cases']
                data['new_deaths'] = int(new_deaths) if new_deaths else data['new_deaths']
                data['total_deaths'] = int(total_deaths) if total_deaths else data['total_deaths']
                data['total_cases'] = int(total_cases) if total_cases else data['total_cases']
                
            data_obj = Data(name=data['name'], new_cases=data['new_cases'], new_deaths=data['new_deaths'], 
                total_deaths=data['total_deaths'], total_cases=data['total_cases'])
            data_objects_list.append(data_obj)

            new_report = CoronaReport(data=data_objects_list)
            new_report.save()
        return send_response({'status': SUCCESS, 'message':'Corona Report updated'})        
        

class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects(is_spam__ne=True).order_by('-created_at', '-_id')
    serializer_class = TwitterDataSerializer

    def get(self, request, *args, **kwargs):
        category = request.query_params.get('category')
        if category:
            category_obj = Category.objects(_id=category).first()
            if not category_obj:
                return send_response({'status': INVALID_PARAMETERS, 'message':'Category not found'})
            else:
                self.queryset = self.queryset(category=category).order_by('-created_at', '-_id')
        return super().get(request, *args, **kwargs)


class SpamCountView(generics.ListCreateAPIView):
    http_method_names = ['put']
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
            is_spam = False
            if request.user.email in spam_users:
                return send_response({'status': BAD_REQUEST, 'data': 'You have already mark this as spam'})
            else:
                spam_users.append(request.user.email)
                spam_count = tweet.spam_count + 1            
                if len(spam_users) > 10 or request.user.is_superuser:
                    is_spam = True
                tweet.update(spam_count=spam_count, is_spam=is_spam, spam_users=spam_users)
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
