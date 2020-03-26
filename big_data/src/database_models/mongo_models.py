from mongoengine import DynamicDocument, StringField, DateTimeField
import datetime


class TwitterData(DynamicDocument):
    text = StringField(required=True, max_length=200)
    created_at = DateTimeField(default=datetime.datetime.now)
    meta = {'allow_inheritance': True}

class Category(DynamicDocument):
    _id = StringField(required=True, max_length=200)
    created_at = DateTimeField(default=datetime.datetime.now)
    meta = {'allow_inheritance': True}
