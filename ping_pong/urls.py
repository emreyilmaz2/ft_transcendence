from django.urls import path
from .import views
from .views import UserRegistrationView, UserLoginView, UserLogoutView, ListUsersView, UserUpdateView, sendFriendRequest, ViewFriendRequest, AcceptFriendRequest, FriendListAPIView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('users/', ListUsersView.as_view(), name='user-list'),
    path('profile_update/', UserUpdateView.as_view(), name='profile-update'),
    path('send_friend_request/', sendFriendRequest.as_view(), name='send_friend_request'),
    path('friend_requests/', ViewFriendRequest.as_view(), name='friend_request'),
    path('friend_list/', FriendListAPIView.as_view(), name='friend_list'),
    path('accept_friend_request/', AcceptFriendRequest.as_view(), name='accept_friend_request'),
]
