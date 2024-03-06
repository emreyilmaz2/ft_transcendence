from django.contrib.auth import get_user_model
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import Friendship
from django.contrib.auth.models import User


User = get_user_model()

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

class UserLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Geçersiz kimlik bilgileri.")
    
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'avatar', 'friends']

class FriendshipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Friendship
        fields = ['id', 'sender', 'receiver', 'status']

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
        #instance.first_name = validated_data.get('name', instance.first_name)
        #instance.last_name = validated_data.get('surname', instance.last_name)
        #instance.email = validated_data.get('mail', instance.email)
        instance.username = validated_data.get('username', instance.username)
        if validated_data.get('password1') and validated_data.get('password2'):
            instance.set_password(validated_data['password1'])
        instance.save()
        return instance