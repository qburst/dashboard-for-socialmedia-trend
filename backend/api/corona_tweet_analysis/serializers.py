from rest_framework_mongoengine import serializers
from  corona_tweet_analysis.models import TwitterData, Category, CoronaReport, UserHashtag
from rest_framework import serializers as rest_serializers


class TwitterDataSerializer(serializers.DocumentSerializer):
    class Meta:
        model = TwitterData
        fields = '__all__'


class CategorySerializer(serializers.DocumentSerializer):
    class Meta:
        model = Category
        fields = '__all__'


class UserHashtagSerializer(rest_serializers.ModelSerializer):
    class Meta:
        model = UserHashtag
        fields = '__all__'