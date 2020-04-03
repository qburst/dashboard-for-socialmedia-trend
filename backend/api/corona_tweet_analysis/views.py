from json import loads
from corona_tweet_analysis.utils.responses import send_response
from corona_tweet_analysis.utils.constants import SUCCESS, FAIL, INVALID_PARAMETERS, BAD_REQUEST, UNAUTHORIZED
from corona_tweet_analysis.models import TwitterData, Category, CoronaReport, Hashtag
from rest_framework.authentication import TokenAuthentication
from rest_framework import permissions, generics, viewsets
from corona_tweet_analysis.serializers import TwitterDataSerializer,HashtagSerializerAdmin, \
    HashtagSerializerUser, CategorySerializerAdmin, CategorySerializerUser
from rest_framework.response import Response
from .permissions import UpdateOwnObject


class CoronaWorldReportView(generics.ListAPIView):
    http_method_names = ['get']

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


class CoronaReportView(generics.ListAPIView):
    http_method_names = ['get']

    def get(self, request, *args, **kwargs):
        country = request.query_params.get('country')
        if not country:
            return send_response({'status': INVALID_PARAMETERS, 'message':'Country not sent'})
        corona_report = CoronaReport.objects.order_by('-created_at').first()
        data = loads(corona_report.to_json())
        created_at = data['created_at']
        data = {}
        for country in data['data']:
            if country['name'] == country:
                data = country
            else:
                return send_response({'status': INVALID_PARAMETERS, 'message':'Country not found'})
        return Response({
            'status': SUCCESS,
            'data': data,
            'created_at': corona_report.created_at
        })


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


class HashtagsViewset(viewsets.ModelViewSet):
    queryset = Hashtag.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (TokenAuthentication,)
    http_method_names = ['get', 'put', 'post']

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return HashtagSerializerAdmin
        return HashtagSerializerUser

    def get_permissions(self):
        if not self.request.user.is_superuser and self.request.method == 'PUT':
            self.permission_classes = [permissions.IsAuthenticated, UpdateOwnObject]
        else:
            self.permission_classes = [permissions.IsAuthenticated, ]

        return super(HashtagsViewset, self).get_permissions()


class CategoryViewset(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    permission_classes = [permissions.IsAuthenticated, ]
    authentication_classes = (TokenAuthentication,)
    http_method_names = ['get', 'put', 'post']

    def get_serializer_class(self):
        if self.request.user.is_superuser:
            return CategorySerializerAdmin
        return CategorySerializerUser

    def get_permissions(self):
        if not self.request.user.is_superuser and self.request.method == 'PUT':
            self.permission_classes = [permissions.IsAuthenticated, UpdateOwnObject]
        else:
            self.permission_classes = [permissions.IsAuthenticated, ]

        return super(CategoryViewset, self).get_permissions()
