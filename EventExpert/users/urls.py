from django.urls import path
from .views import register_user, get_user_profile
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),  # JWT token endpoint for login
    path('profile/', get_user_profile, name='profile'),  # User profile endpoint
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  # JWT refresh token
]
