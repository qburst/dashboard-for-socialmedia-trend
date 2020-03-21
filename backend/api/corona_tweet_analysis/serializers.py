from .models import TwitterData
# from rest_framework import serializers
from rest_framework_mongoengine import serializers


class TwitterDataSerializer(serializers.DocumentSerializer):
    class Meta:
        model = TwitterData
        fields = ('id', 'text')


class CategorySerializer(serializers.DocumentSerializer):
    class Meta:
        model = TwitterData
        fields = ('text')