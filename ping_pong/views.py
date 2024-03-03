from django.shortcuts import render

from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, UserLoginSerializer

# Create your views here.

User = get_user_model()

class UserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(user.id, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.validated_data
            login(request, user)  # Kullanıcıyı oturum aç
            return Response({
                "user_id": user.id,
                "message": "Başarili giriş."
            }, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        # Kullanıcıyı oturumdan çıkış yap
        logout(request)
        return Response({"message": "Başarılı çıkış."}, status=status.HTTP_200_OK)