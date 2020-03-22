import datetime
import mongoengine
# from django.utils import timezone
# from django.utils.translation import ugettext_lazy as _
# from django.contrib import auth
# from django.contrib.auth.models import User
# from mongoengine.django.auth import User
from mongoengine import fields, DynamicDocument, EmbeddedDocument


# class User(DynamicDocument):    
#     id = fields.IntField(primary_key=True)
#     username = fields.StringField(required=True)
#     email = fields.EmailField()
#     name = fields.StringField()
#     password = fields.StringField(
#         max_length=128,
#         verbose_name=_('password'),
#         help_text=_("Use '[algo]$[iterations]$[salt]$[hexdigest]' or use the <a href=\"password/\">change password form</a>.")
#     )
#     is_active = fields.BooleanField(default=True)
#     is_superuser = fields.BooleanField(default=False)
#     last_login = fields.DateTimeField(default=timezone.now, verbose_name=_('last login'))
#     date_joined = fields.DateTimeField(default=timezone.now, verbose_name=_('date joined'))

#     USERNAME_FIELD = 'username'
#     REQUIRED_FIELDS = ['email']

#     def __str__(self):
#         return self.username

class HashTag(EmbeddedDocument):
    text = fields.StringField()
    indices = fields.ListField(fields.IntField(), default=list)

class Category(DynamicDocument):
    _id = fields.StringField(primary_key=True)
    created_at = fields.DateTimeField(default=datetime.datetime.now())

    # def save(self, *args, **kwargs):
    #     return super(Category, self).save(*args, **kwargs)


class TwitterData(DynamicDocument):
    # _id = fields.IntField(primary_key=True)
    text = fields.StringField(required=True)
    country = fields.ListField(fields.StringField(),default=list)
    created_at = fields.DateTimeField(default=datetime.datetime.now())
    category = fields.ListField(fields.StringField(), default=list)
    # Use this once separate Cateory table is formed
    # category = ListField(ReferenceField(Category))
    hashtags = fields.ListField(fields.EmbeddedDocumentField(HashTag), default=list)
    # spam_count = fields.ListField(fields.ReferenceField(User))
    spam_count = fields.IntField(default=0)
    meta = {'allow_inheritance': True}

