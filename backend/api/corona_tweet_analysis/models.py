import datetime
from mongoengine import fields, DynamicDocument, EmbeddedDocument
from djongo import models


class TwitterData(DynamicDocument):
    text = fields.StringField(required=True)
    country = fields.ListField(fields.StringField(),default=list)
    created_at = fields.DateTimeField(default=datetime.datetime.now)
    category = fields.ListField(fields.StringField(), default=list)
    hashtags = fields.ListField(fields.StringField(), default=list)
    spam_count = fields.IntField(default=0)
    is_spam = fields.BooleanField(default=False)
    spam_users = fields.ListField(fields.StringField(), default=list)
    url = fields.StringField()
    meta = {'allow_inheritance': True}


class Data(EmbeddedDocument):
    name = fields.StringField(required=True)
    new_cases = fields.StringField(required=True)
    new_deaths = fields.StringField(required=True)
    total_cases = fields.StringField(required=True)
    total_deaths = fields.StringField(required=True)


class CoronaReport(DynamicDocument):
    created_at = fields.DateTimeField(default=datetime.datetime.now)
    data = fields.ListField(fields.EmbeddedDocumentField(Data), default=list)
    meta = {'allow_inheritance': True}


class Category(models.Model):
    category = models.TextField(unique=True)
    keywords = models.TextField()
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_or_modified_by = models.TextField()
    approved_by = models.TextField()


class Hashtag(models.Model):
    hashtag = models.TextField(unique=True)
    approved = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_or_modified_by = models.TextField()
    approved_by = models.TextField()