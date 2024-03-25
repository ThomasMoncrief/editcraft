from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

# Create your models here.
class User(AbstractUser):
    key = models.CharField(max_length=100, blank=True, default="")

class Archive(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50, default="Untitled")
    edited_text = models.TextField()
    original_text = models.TextField(default="")
    submit_time = models.DateTimeField(default=datetime.now)
    final_text = models.TextField(default="", blank=True)