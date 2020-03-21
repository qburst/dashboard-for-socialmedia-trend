from django.urls import include, path
from rest_framework import routers
from corona_tweet_analysis import views

# Wire up our API using automatic URL routing.
# Additionally, we include login URLs for the browsable API.
urlpatterns = [
    path('categories/', views.CategoryViewset, name='CategoryView'),
    path('tweets/', views.TwitterDataView.as_view(), name='TwitterDataView'),
    # path('add_spam_count/', views.SpamCountViewset, name='SpamCountView'),
]

