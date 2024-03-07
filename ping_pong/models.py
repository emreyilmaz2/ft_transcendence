from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings

# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)  # Örnek bir avatar alanı
    # friends = models.ManyToManyField('User', related_name='user_friends', blank=True)
    has_logged_in = models.BooleanField(default=False)

class FriendList(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="user")
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, blank=True, related_name="friends")
    
    def __str__(self):
        return self.user.name
    def add_friend(self, friend):
        # Adding a new friend
        if not friend in self.friends.all():
            self.friends.add(friend)
            self.save()
    def remove_friend(self, friend):
        # removing an existing friend
        if friend in self.friends.all():
            self.friends.remove(friend)
            self.save()
    def unfriend(self, friende):
        # Unfriending someone
        remove_friend_list = self
        remove_friend_list.remove_friend(friende)
        # Remove yourself the list that belongs the person
        friendList = FriendList.object.get(user=friende)
        friendList.remove_friend(self.user)
    def is_friend(self, friend):
        # Check if we are friend
        if friend in self.friends.all():
            return True
        return False

class FriendRequest(models.Model):
    sender = models.ForeignKey(User, related_name='sent_friend_requests', on_delete=models.CASCADE)
    receiver = models.ForeignKey(User, related_name='received_friend_requests', on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=(('pending', 'Beklemede'), ('accepted', 'Kabul Edildi'), ('rejected', 'Reddedildi')), default='pending')
    is_active = models.BooleanField(blank=True, null=False, default=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.sender.username
    def accept(self):
        # Accept a friend Request
        receiver_friend_list = FriendList.objects.get(user=self.receiver)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = FriendList.objects.get(user=self.sender)
            if sender_friend_list:
                sender_friend_list. add_friend (self.receiver)
                self.is_active = False
                self.save ()
    def decline(self):
        # Decline a friend request
        self.is_active = False
        self.save ()
    def cancel(self):
        # Cancel a friend request
        self.is_active = False
        self.save ()