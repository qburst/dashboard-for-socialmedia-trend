from django.urls import include, path
from rest_framework import routers
from corona_tweet_analysis import views

urlpatterns = [
    path('categories/', views.CategoryView.as_view(), name='CategoryView'),
    path('tweets/', views.TwitterDataView.as_view(), name='TwitterDataView'),
    path('add_spam_count/', views.SpamCountView.as_view(), name='SpamCountView'),
]

