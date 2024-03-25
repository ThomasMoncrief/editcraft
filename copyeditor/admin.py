from django.contrib import admin
from .models import User, Archive

# Register your models here.
admin.site.register(User)
admin.site.register(Archive)