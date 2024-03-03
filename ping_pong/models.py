from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)  # Örnek bir avatar alanı
    friends = models.ManyToManyField('User', related_name='user_friends', blank=True)

