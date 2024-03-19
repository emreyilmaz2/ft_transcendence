from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate, password_validation
from .models import FriendRequest
from django.conf import settings
from django.contrib.auth.models import User

User = get_user_model()

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

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
        fields = ['id', 'username','first_name', 'last_name', 'email', 'date_joined', 'avatar', 'friends']

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


class UpdateUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True, validators=[password_validation.validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    old_password = serializers.CharField(write_only=True, required=True)
    avatar = serializers.ImageField(required=False)

    class Meta:
        model = User
        fields = ('username', 'first_name', 'last_name', 'email', 'old_password', 'password', 'password2', 'avatar')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'password': {'required': True},
            'password2': {'required': True},
            'old_password': {'required': True},
        }

    def validate(self, attrs):
        current_user = self.context['request'].user
        if attrs.get('password') != attrs.get('password2'):
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        elif User.objects.exclude(pk=current_user.pk).filter(email=attrs.get('email')).exists():
            raise serializers.ValidationError({"email": "This email is already in use."})
        elif User.objects.exclude(pk=current_user.pk).filter(username=attrs.get('username')).exists():
            raise serializers.ValidationError({"username": "This username is already in use."})
        elif 'old_password' in attrs and not current_user.check_password(attrs['old_password']):
            raise serializers.ValidationError({"old_password": "Old password is not correct"})
        return attrs

    def update(self, instance, validated_data):
        user = self.context['request'].user
        if user.pk != instance.pk:
            raise serializers.ValidationError({"authorize": "You dont have permission for this user."})
        
        # Update standard user fields
        instance.first_name = validated_data['first_name']
        instance.last_name = validated_data['last_name']
        instance.email = validated_data['email']
        instance.username = validated_data['username']
        instance.has_logged_in = False
        
        if 'avatar' in validated_data:
            instance.avatar = validated_data['avatar']
        else:
            instance.avatar = settings.DEFAULT_USER_AVATAR

        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
        
        instance.save()
        return instance
