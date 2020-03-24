import datetime
import mongoengine
from mongoengine import fields, DynamicDocument, EmbeddedDocument

class HashTag(EmbeddedDocument):
    text = fields.StringField()
    indices = fields.ListField(fields.IntField(), default=list)

class Category(DynamicDocument):
    _id = fields.StringField(primary_key=True)
    created_at = fields.DateTimeField(default=datetime.datetime.now())

class TwitterData(DynamicDocument):
    text = fields.StringField(required=True)
    country = fields.ListField(fields.StringField(),default=list)
    created_at = fields.DateTimeField(default=datetime.datetime.now())
    category = fields.ListField(fields.StringField(), default=list)
    hashtags = fields.ListField(fields.StringField(), default=list)
    spam_count = fields.IntField(default=0)
    is_spam = fields.BooleanField(default=False)
    spam_users = fields.ListField(fields.StringField(), default=list)
    url = fields.StringField()

    meta = {'allow_inheritance': True}