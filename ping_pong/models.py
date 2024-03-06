from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)  # Örnek bir avatar alanı
    friends = models.ManyToManyField('User', related_name='user_friends', blank=True)

class Friendship(models.Model):
    sender = models.ForeignKey(User, related_name='sent_friend_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_friend_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=(('pending', 'Beklemede'), ('accepted', 'Kabul Edildi'), ('rejected', 'Reddedildi')), default='pending')