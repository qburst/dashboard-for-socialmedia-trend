from mongoengine import *
import datetime

class HashTag(EmbeddedDocument):
    text = StringField()
    indices = ListField(IntField(), default=list)

class Category(DynamicDocument):
    name = StringField()

class TwitterData(DynamicDocument):
    text = StringField(required=True)
    country = StringField(required=True)
    created_at = DateTimeField(default=datetime.datetime.now())
    category = ListField(StringField(), default=list)
    # Use this once separate Cateory table is formed
    # category = ListField(ReferenceField(Category))
    hashtags = ListField(EmbeddedDocumentField(HashTag), default=list)
    meta = {'allow_inheritance': True}

