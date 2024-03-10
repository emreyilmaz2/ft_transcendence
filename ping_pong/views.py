from django.shortcuts import render
from django.contrib.auth import get_user_model, login, logout, authenticate
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import UserRegistrationSerializer, UserSerializer, UpdateSerializer, FriendRequestSerializer, FriendSerializer
from rest_framework.generics import ListAPIView
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from rest_framework.filters import OrderingFilter
from .filters import UserFilter
from rest_framework.permissions import IsAuthenticated
import django_filters
import jwt, datetime, json
from django.http import HttpResponse
from .models import FriendRequest
from django.db.models import Q

# Create your views here.

User = get_user_model()


class FriendListAPIView(APIView):
    def get(self, request, *args, **kwargs):
        current_user = request.user
        if current_user.is_authenticated:
            friend_list_data = {
                'user': current_user.username,
                'friends': FriendSerializer(current_user.friends.all(), many=True).data
            }
            return Response(friend_list_data, status=status.HTTP_200_OK)
        else:
            return Response("You must be authenticated to view your friends.", status=status.HTTP_401_UNAUTHORIZED)

class ListUsersView(ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        # Giriş yapmış olan kullanıcının ID'sini al
        current_user_id = self.request.user.id
        return User.objects.exclude(id=current_user_id)
    
    queryset = User.objects.all()
    serializer_class = UserSerializer
    filter_backends = [django_filters.rest_framework.DjangoFilterBackend, OrderingFilter]
    filterset_class = UserFilter

class UserRegistrationView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            return Response(user.id, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        if not username or not password: # Eger sifre veya username eksik ise giris yapmamali
            return Response({'error': 'Kullanıcı adı ve şifre gerekli'}, status=status.HTTP_400_BAD_REQUEST)
        
        user = authenticate(username=username, password=password)
        if user is not None and not user.has_logged_in:
            login(request, user)  # Kullanıcıyı oturum aç
            user.has_logged_in = True
            user.save()  # Kullanıcıyı kaydet

            payload = {
                'id': user.id,
                'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),
                'iat': datetime.datetime.utcnow()
            }
            token = jwt.encode(payload, 'secret', algorithm='HS256')
            response = Response()
            response.set_cookie(key='jwt', value=token, httponly=True)
            response.data = token
            return response
        elif user is not None and user.has_logged_in:
            return Response({'error': 'Kullanıcı zaten oturum açmış'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'error': 'Geçersiz kimlik bilgileri'}, status=status.HTTP_400_BAD_REQUEST)

class   UserLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(username=username, password=password)
        if not user.is_authenticated or not user.has_logged_in:
            return Response({"message": "Çıkış yapmak için önce giriş yapmalısınız."}, status=status.HTTP_401_UNAUTHORIZED)
        logout(request)
        user.has_logged_in = False
        user.save()
        return Response({"message": "Başarılı çıkış."}, status=status.HTTP_200_OK)

class UserUpdateView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        serializer = UpdateSerializer(data=request.data)
        if serializer.is_valid():
            username = serializer.validated_data.get('username')
            password = serializer.validated_data.get('password')

            user = request.user  # Assuming user is authenticated
            if user:
                # Update user object
                user.username = username
                user.set_password(password)
                user.save()
                return Response({'message': 'User information updated successfully'}, status=status.HTTP_200_OK)
            else:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class sendFriendRequest(APIView):
    def post(self, request, *args, **kwargs):
        current_user = request.user
        payload = {}
        if request.method == "POST" and current_user.is_authenticated:
            username = request.data.get('username')
            if username:
                receiver = User.objects.get(username=username)
                if receiver == current_user:
                    payload['response'] = "You can't send a friend request to yourself."
                    return HttpResponse(json.dumps(payload), content_type="application/json")
                try:
                    # Get any friend requests (active and not-active)
                    friend_requests_sent = FriendRequest.objects.filter(sender=current_user, status='pending')
                    friend_requests_received = FriendRequest.objects.filter(receiver=current_user, status='pending')
                    # find if any of them are active
                    try:
                        for request in friend_requests_sent | friend_requests_received:
                            if request.is_active:
                                if request.sender == current_user and request.receiver == receiver:
                                    raise Exception("You already sent them a friend request.")
                                elif request.receiver == current_user and request.sender == receiver:
                                    raise Exception("You already received a friend request from them.")
                        # If none are active, then create a new friend request
                        friend_request = FriendRequest(sender=current_user, receiver=receiver)
                        friend_request.save()
                        payload['response'] = "Friend request sent."
                    except Exception as e:
                        payload ['response'] = str(e)
                except FriendRequest.DoesNotExist:
                    # There are no friend requests so create one.
                    friend_request = FriendRequest(sender=current_user, receiver=receiver)
                    friend_request.save()
                    payload ['response'] = "Friend request sent."
                if payload['response'] == None:
                    payload['response'] = "Something went wrong."
            else:
                payload['response'] = "Unable to send a friend request"
        else:
            payload['response'] = "You must be Authenticated to send a friend request"
        return HttpResponse(json.dumps(payload), content_type="application/json")

class AcceptFriendRequest(APIView):
    # Accepting the requests
    def post(self, request, *args, **kwargs):
        current_user = request.user
        payload = {}
        receiver = User.objects.get(username=request.data.get('username'))
        if request.method == "GET" and current_user.is_authenticated:
            if receiver:
                friend_request = FriendRequest(sender=current_user, receiver=receiver)
                # friend_request = FriendRequest.objects.get(pk=request_id)
                # confirm that is the correct request
                if friend_request.receiver == current_user:
                    if friend_request:
                        # found the request. Not accept it.
                        friend_request.accept()
                        payload ['response'] = "Friend request accepted"
                    else:
                        payload ['response'] = "Something went wrong"
                else:
                    payload ['response'] = "That is not your request to accept."
            else:
                payload ['response'] = "Unable to accept that friend request."
        else:
            payload ['response'] = "You must be authenticated to accept a friend request."
        return HttpResponse (json.dumps(payload), content_type="application/json")


class ViewFriendRequest(APIView):
    # Get the requests
    def get(self, request, *args, **kwargs):
        payload = {}
        user = request.user
        if user.is_authenticated:
            current_user = User.objects.get(pk=user.id)
            if current_user == user:
                friend_requests_sent = FriendRequest.objects.filter(sender=user, status='pending')
                friend_requests_received = FriendRequest.objects.filter(receiver=user, status='pending')
                
                # Hem gönderilen hem de alınan istekleri birleştirin
                friend_requests = friend_requests_sent | friend_requests_received
                
                # Serializer kullanarak JSON'a dönüştürme
                serializer = FriendRequestSerializer(friend_requests, many=True)
                payload['friend_requests'] = serializer.data
            else:
                payload['response'] = "You can't view another users friend requests."
        else:
            payload['response'] = "You must be Authenticated to view"
        return HttpResponse(json.dumps(payload), content_type="application/json")