import mongoengine
from django.shortcuts import render
from corona_tweet_analysis.utils.base_view import BaseViewManager
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS, BAD_REQUEST, UNAUTHORIZED
from corona_tweet_analysis.models import TwitterData, Category, CoronaReport, CategorySQL, Hashtag
from corona_tweet_analysis import serializers
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, generics
from corona_tweet_analysis.serializers import TwitterDataSerializer, CategorySerializer, CoronaReportSerializer, \
    HashtagSerializer
from .permissions import UpdateHashtag


class CategoryView(generics.ListAPIView):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer


class CoronaReportView(generics.ListAPIView):
    queryset = CoronaReport.objects.order_by('-created_at').limit(1)
    serializer_class = CoronaReportSerializer


class TwitterDataView(generics.ListAPIView):
    queryset = TwitterData.objects(is_spam__ne=True).order_by('-created_at', '-_id')
    serializer_class = TwitterDataSerializer

    def get(self, request, *args, **kwargs):
        category = request.query_params.get('category')
        if category:
            category_obj = Category.objects(_id=category).first()
            if not category_obj:
                return send_response({'status': INVALID_PARAMETERS, 'message': 'Category not found'})
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
                return send_response({'status': INVALID_PARAMETERS, 'message': 'Tweet id is required'})
            tweet = TwitterData.objects(id=tweet_id).first()
            if not tweet:
                return send_response({'status': FAIL, 'message': 'Tweet not found'})

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


class HashtagsView(generics.ListCreateAPIView):
    queryset = Hashtag.objects.all()
    serializer_class = HashtagSerializer

    def get(self, request, *args, **kwargs):
        hashtag_id = request.query_params.get('hashtag_id')
        if hashtag_id:
            hashtag_obj = Hashtag.objects.filter(id=hashtag_id)
            if not hashtag_obj:
                return send_response({'status': INVALID_PARAMETERS, 'message': 'Hashtag not found'})
            else:
                self.queryset = hashtag_obj
        return super().get(request, *args, **kwargs)

    def post(self, request, *args, **kwargs):
        try:
            if request.user.is_authenticated:
                hashtag_str = request.data.get("hashtag")
                if not hashtag_str:
                    return send_response({'status': BAD_REQUEST, 'message': 'Hashtag id  is required'})
                created_user = request.user
                hashtag = Hashtag(hashtag=hashtag_str, created_or_modified_by=created_user)
                hashtag.save()
            else:
                return send_response({'status': BAD_REQUEST, 'message': 'User is not logged in'})
            return send_response({'status': SUCCESS, 'message': 'Hashtag' + hashtag_str + "created"})
        except Exception as err:
            return send_response({'status': FAIL})

    def put(self, request, *args, **kwargs):
        try:
            print(self.checkSuperUser(request))
            if not request.user.is_authenticated:
                return send_response({'status': BAD_REQUEST, 'message': 'User is not logged in'})
            hashtag_id = request.query_params.get('hashtag_id')
            if not hashtag_id:
                return send_response({'status': INVALID_PARAMETERS, 'message': 'Hashtag id is required'})
            hashtag_obj = Hashtag.objects.filter(id=hashtag_id)
            if not hashtag_obj:
                return send_response({'status': INVALID_PARAMETERS, 'message': 'Hashtag not found'})
            approved = request.data.get("approved")
            if approved:
                if not self.checkSuperUser(request):
                    return send_response(
                        {'status': BAD_REQUEST, 'message': 'User is not a superuser user to approve/disapprove'})
            hashtag_text = request.data.get("hashtag")
            if not hashtag_text:
                return send_response({'status': BAD_REQUEST, 'message': 'Hashtag is required'})
            if approved and self.checkSuperUser(request):
                if approved == 'true':
                    approved = True
                else:
                    approved = False
                Hashtag.objects.filter(id=hashtag_id).update(hashtag=hashtag_text, approved=approved)
            else:
                if not self.checkSuperUser(request) and hashtag_obj.values('created_or_modified_by')[0].get('created_or_modified_by') != request.user:
                    return send_response({'status': BAD_REQUEST, 'message': 'User is not admin or owner of hashtag'})
                Hashtag.objects.filter(id=hashtag_id).update(hashtag=hashtag_text)
            return send_response({'status': SUCCESS, 'message': 'Hashtag updated successfully'})

        except Exception as err:
            return send_response({'status': FAIL})

    def checkSuperUser(self,request):
        if request.user.is_superuser:
            return True
        return False
