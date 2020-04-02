from django.urls import path, include
from corona_tweet_analysis import views
from rest_framework.routers import DefaultRouter


router = DefaultRouter()
router.register('hashtags', views.HashtagsViewset)
router.register('categories', views.CategoryViewset)

urlpatterns = [
    path('tweets/', views.TwitterDataView.as_view(), name='TwitterDataView'),
    path('add_spam_count/', views.SpamCountView.as_view(), name='SpamCountView'),
    path('get_statistics/', views.StatisticsView.as_view(), name='StatisticsView'),
    path('report/world/', views.CoronaWorldReportView.as_view(), name='CoronaReportView'),
    path('report/', views.CoronaReportView.as_view(), name='CoronaReportView'),
    path('', include(router.urls)),
]

