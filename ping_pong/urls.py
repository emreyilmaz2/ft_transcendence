from django.urls import path
from . import views
from .views import UserRegistrationView, UserLoginView, UserLogoutView, ListUsersView

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='user-register'),
    path('login/', UserLoginView.as_view(), name='user-login'),
    path('logout/', UserLogoutView.as_view(), name='user-logout'),
    path('users/', ListUsersView.as_view(), name='user-list'),
]
