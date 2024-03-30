from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist

# Create your models here.
class User(AbstractUser):
    avatar = models.ImageField(upload_to='images/', null=True, blank=True)  # Örnek bir avatar alanı
    friends = models.ManyToManyField('User', related_name='user_friends', blank=True)
    has_logged_in = models.BooleanField(default=False)
    matches = models.ManyToManyField('Match', related_name='player_matches', blank=True)
    otp = models.CharField(max_length=6, blank=True, null=True)

    def get_match_history(self):
        return self.matches.all()
    def __str__(self):
        return self.username
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
        friendList = User.objects.get(username=friende.username)
        friendList.remove_friend(self)
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
        receiver_friend_list = User.objects.get(id=self.receiver.id)
        if receiver_friend_list:
            receiver_friend_list.add_friend(self.sender)
            sender_friend_list = User.objects.get(id=self.sender.id)
            if sender_friend_list:
                sender_friend_list.add_friend(self.receiver)
                self.is_active = False
                self.status = 'accepted'
                self.save()
    def decline(self):
        # Decline a friend request
        self.is_active = False
        self.status = 'rejected'
        self.save ()
    def cancel(self):
        # Cancel a friend request
        self.is_active = False
        self.save ()

class Match(models.Model):
    player1 = models.CharField(max_length=100) # Kullanıcı adı veya konuk oyuncu adı
    player2 = models.CharField(max_length=100)
    score = models.CharField(max_length=10)
    result = models.CharField(max_length=10, choices=[('win', 'Win'), ('loss', 'Loss'), ('draw', 'Draw')])
    match_date = models.DateField()
    
    def __str__(self):
        return f"{self.player1} vs {self.player2} | {self.score} | {self.result} | {self.match_date}"