from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime

# Create your models here.
class User(AbstractUser):
    key = models.CharField(max_length=100, blank=True, default="")

class Archive(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=50, default="Untitled")
    submit_time = models.DateTimeField(default=datetime.now)
    original_text = models.TextField(default="")
    edited_text = models.TextField()
    final_text = models.TextField(default="", blank=True)
    diffs = models.TextField(default="")