from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, register, authenticated, create_posts, logout, get_posts,    toggle_like, send_follow_request, accept_follow_request, reject_follow_request, cancel_follow_request, unfollow_user, update_user_profile, get_user_posts, get_user_profile, get_followers, get_followings, get_post_likes

urlpatterns=[
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
    path('register/',register,name='register'),
    path('authenticated/',authenticated,name='authenticated'),
    path('create_post/',create_posts,name="create_post"),
    path('logout/', logout,name='logout'),
    path('get_posts/', get_posts,name='get_posts'),
    path('get_user_posts/<str:username>/', get_user_posts,name='get_user_posts'),
    path('toggle_like/<str:post_id>/', toggle_like,name='toggle_like'),
    path('send_follow_request/<str:username>/', send_follow_request,name='send_follow_request'),
    path('accept_follow_request/<str:username>/', accept_follow_request,name='accept_follow_request'),
    path('reject_follow_request/<str:username>/', reject_follow_request,name='reject_follow_request'),
    path('cancel_follow_request/<str:username>/', cancel_follow_request,name='cancel_follow_request'),
    path('unfollow_user/<str:username>/', unfollow_user,name='unfollow_user'),
    path('update_user_profile/', update_user_profile,name='update_user_profile'),
    path('get_user_profile/<str:username>/', get_user_profile,name='get_user_profile'),
    path('get_followers/<str:username>/', get_followers,name='get_followers'),
    path('get_followings/<str:username>/', get_followings,name='get_followings'),
    path('get_post_likes/<str:post_id>/', get_post_likes,name='get_post_likes'),

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)