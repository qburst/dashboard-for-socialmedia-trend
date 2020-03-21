from django.urls import include, path
from rest_framework import routers
from corona_tweet_analysis import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('categories/', views.CategoryDataViewset.as_view(), name='CategoryView'),
    path('tweets/', views.TwitterDataViewManager.as_view(), name='TwitterDataViewManager'),
    # path('add_spam_count/', views.SpamCountViewset.as_view(), name='SpamCountView'),
]

