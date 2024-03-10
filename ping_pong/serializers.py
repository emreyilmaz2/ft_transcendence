from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import FriendRequest
from django.contrib.auth.models import User


User = get_user_model()

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name']

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'avatar')
    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'friends']

class FriendRequestSerializer(serializers.ModelSerializer):
    sender = serializers.SerializerMethodField()
    receiver = serializers.SerializerMethodField()
    class Meta:
        model = FriendRequest
        fields = ['id', 'sender', 'receiver', 'status', 'timestamp']

    def get_sender(self, obj):
        sender_id = obj.sender.id
        sender_username = obj.sender.username
        return f"{sender_id} - {sender_username}"
    def get_receiver(self, obj):
        receiver_id = obj.receiver.id
        receiver_username = obj.receiver.username
        return f"{receiver_id} - {receiver_username}"

class UpdateSerializer(serializers.Serializer):
    name = serializers.CharField(required=False)
    surname = serializers.CharField(required=False)
    mail = serializers.EmailField(required=False)
    username = serializers.CharField(required=False)
    password1 = serializers.CharField(required=False)
    password2 = serializers.CharField(required=False)

    def validate(self, data):
        if data.get('password1') != data.get('password2'):
            raise serializers.ValidationError("Passwords do not match")
        return data

    def update(self, instance, validated_data):
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('mail', instance.email)
        instance.first_name = validated_data.get('name', instance.first_name)
        instance.last_name = validated_data.get('surname', instance.last_name)
        
        password1 = validated_data.get('password1')
        if password1:
            instance.set_password(password1)
        
        instance.save()
        return instance
