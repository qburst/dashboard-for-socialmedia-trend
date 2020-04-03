from rest_framework_mongoengine import serializers
from corona_tweet_analysis.models import TwitterData, Category, CoronaReport, Hashtag
from rest_framework import serializers as rest_serializers


class TwitterDataSerializer(serializers.DocumentSerializer):
    class Meta:
        model = TwitterData
        fields = '__all__'


class HashtagSerializerAdmin(rest_serializers.ModelSerializer):
    def create(self, validated_data):
        if validated_data['approved']:
            hashtag = Hashtag(hashtag=validated_data['hashtag'], approved=validated_data['approved'],
                              created_by=str(self.context['request'].user),
                              approved_by=str(self.context['request'].user))
        else:
            hashtag = Hashtag(hashtag=validated_data['hashtag'], approved=validated_data['approved'],
                              created_by=str(self.context['request'].user))
        hashtag.save()
        return hashtag

    def update(self, instance, validated_data):
        if validated_data['approved']:
            instance.approved_by = str(self.context['request'].user)
        else:
            instance.approved_by = ""
        instance.approved = validated_data['approved']
        instance.hashtag = validated_data['hashtag']
        instance.save()
        return instance

    class Meta:
        model = Hashtag
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by', 'approved_by', 'updated_at']


class HashtagSerializerUser(rest_serializers.ModelSerializer):
    def create(self, validated_data):
        hashtag = Hashtag(hashtag=validated_data['hashtag'], created_by=str(self.context['request'].user))
        hashtag.save()
        return hashtag

    def update(self, instance, validated_data):
        instance.hashtag = validated_data['hashtag']
        instance.save()
        return instance

    class Meta:
        model = Hashtag
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by', 'approved_by', 'approved', 'updated_at']


class CategorySerializerAdmin(rest_serializers.ModelSerializer):
    def create(self, validated_data):
        if validated_data['approved']:
            category = Category(category=validated_data['category'], keywords=validated_data['keywords'],
                            approved=validated_data['approved'],created_by=str(self.context['request'].user),
                            approved_by=str(self.context['request'].user))
        else:
            category = Category(category=validated_data['category'], keywords=validated_data['keywords'],
                              approved=validated_data['approved'], created_by=
                                str(self.context['request'].user))
        category.save()
        return category

    def update(self, instance, validated_data):
        if validated_data['approved']:
            instance.approved_by = str(self.context['request'].user)
        else:
            instance.approved_by = ""
        instance.approved = validated_data['approved']
        instance.category = validated_data['category']
        instance.keywords = validated_data['keywords']
        instance.save()
        return instance

    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by', 'approved_by', 'updated_at']


class CategorySerializerUser(rest_serializers.ModelSerializer):
    def create(self, validated_data):
        category = Category(category=validated_data['category'], keywords=validated_data['keywords'],
                         created_by=str(self.context['request'].user))
        category.save()
        return category

    def update(self, instance, validated_data):
        instance.category = validated_data['category']
        instance.keywords = validated_data['keywords']
        instance.save()
        return instance

    class Meta:
        model = Category
        fields = '__all__'
        read_only_fields = ['created_at', 'created_by', 'approved_by', 'approved', 'updated_at']
