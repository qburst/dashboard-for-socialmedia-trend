from rest_framework_mongoengine import serializers
from .models import TwitterData, Category


class TwitterDataSerializer(serializers.DocumentSerializer):
    class Meta:
        model = TwitterData
        fields = '__all__'


class CategorySerializer(serializers.DocumentSerializer):
    class Meta:
        model = Category
        fields = '__all__'