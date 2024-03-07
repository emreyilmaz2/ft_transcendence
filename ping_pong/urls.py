from django.urls import path
from .import views
from .views import UserRegistrationView, UserLoginView, UserLogoutView, ListUsersView, UserUpdateView, sendFriendRequest, ViewFriendRequest

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('users/', ListUsersView.as_view(), name='user-list'),
    path('profile_update/', UserUpdateView.as_view(), name='profile-update'),
    path('send_friend_request/<int:receiver_user_id>/', sendFriendRequest.as_view(), name='send_friend_request'),
    path('friend_requests/', ViewFriendRequest.as_view(), name='friend_request'),
]
