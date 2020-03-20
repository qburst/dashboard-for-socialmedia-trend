from mongoengine import DynamicDocument, StringField, DateTimeField
from datetime import datetime


class TwitterData(DynamicDocument):
    text = StringField(required=True, max_length=200)
    created_at = DateTimeField(default=datetime.utcnow())
    meta = {'allow_inheritance': True}