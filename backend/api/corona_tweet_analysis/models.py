import datetime
import mongoengine
from django.utils import timezone
from django.utils.translation import ugettext_lazy as _
from mongoengine import fields, DynamicDocument, EmbeddedDocument, StringField, DateTimeField, IntField, DynamicEmbeddedDocument


class Category(DynamicDocument):
    _id = fields.StringField(primary_key=True)
    created_at = fields.DateTimeField(default=datetime.datetime.now)


class User(DynamicEmbeddedDocument):
    name = fields.StringField(required=True)
    profile_image_url_https = fields.StringField(required=True)


class TwitterData(DynamicDocument):
    text = fields.StringField(required=True)
    user = fields.EmbeddedDocumentField(User)
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
