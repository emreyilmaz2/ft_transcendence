from django.urls import path
from .import views
from .views import UserRegistrationView, UserLoginView, UserLogoutView, ListUsersView, Friends, ViewFriendRequest, FriendListAPIView, Profile

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('users/', ListUsersView.as_view(), name='user-list'),
    path('profile/', Profile.as_view(), name='profile'),
    path('friends/', Friends.as_view(), name='friends'),
    path('pending-requests/', ViewFriendRequest.as_view(), name='pending-requests'),
    path('images/<str:image_name>', views.get_image, name='get_image'),
]