from django.urls import include, path
from rest_framework import routers
from corona_tweet_analysis import views

urlpatterns = [
    path('categories/', views.CategoryView.as_view(), name='CategoryView'),
    path('tweets/', views.TwitterDataView.as_view(), name='TwitterDataView'),
    path('add_spam_count/', views.SpamCountView.as_view(), name='SpamCountView'),
    path('get_statistics/', views.StatisticsView.as_view(), name='StatisticsView'),
    path('report/world/', views.CoronaWorldReportView.as_view(), name='CoronaReportView'),
    path('report/', views.CoronaReportView.as_view(), name='CoronaReportView'),
    path('userHashtags/', views.UserHashtagView.as_view(), name='UserHashtagView')
]

