from django.urls import path
from api import views

urlpatterns = [
    path('infected/', views.InfectedViewManger.as_view(), name='InfectedViewManger'),
]
