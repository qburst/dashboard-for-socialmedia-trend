from django.contrib import admin
from .models import CategorySQL
from .models import Hashtag

admin.site.register(CategorySQL)
admin.site.register(Hashtag)