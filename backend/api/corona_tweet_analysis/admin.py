from django.contrib import admin
from .models import Category
from .models import Hashtag

admin.site.register(Category)
admin.site.register(Hashtag)