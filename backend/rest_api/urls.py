from django.urls import path

from django.conf import settings
from django.conf.urls.static import static
from .views import CustomTokenObtainPairView, CustomTokenRefreshView, register, authenticated, create_posts, logout, get_posts,    toggle_like, send_follow_request, accept_follow_request, reject_follow_request, cancel_follow_request, unfollow_user,get_follow_requests,update_user_profile, get_user_posts, get_user_profile, get_followers, get_followings, get_post_likes, institution_list, user_education_detail, user_education_list_create, get_user_education_detail, create_club, get_club_list, join_club, leave_club, get_club_details, get_club_members, test, get_notifications

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
    path('get_follow_requests/', get_follow_requests,name='get_follow_requests'),
    path('unfollow_user/<str:username>/', unfollow_user,name='unfollow_user'),
    path('update_user_profile/', update_user_profile,name='update_user_profile'),
    path('get_user_profile/<str:username>/', get_user_profile,name='get_user_profile'),
    path('get_followers/<str:username>/', get_followers,name='get_followers'),
    path('get_followings/<str:username>/', get_followings,name='get_followings'),
    path('get_post_likes/<str:post_id>/', get_post_likes,name='get_post_likes'),
    path('get_institutions/',institution_list,name='list_of_colleges'),
    path('update_del_user_education_detail/<str:education_detail_id>/',user_education_detail,name='patch_del_education_detail'),
    path('get_user_education_detail/<str:username>/',get_user_education_detail,name='get_user_education detail'),
    path('user_education_list_create/',user_education_list_create,name='user_education_creation'),
    path('create_club/',create_club,name='create_club'),
    path('get_club_list/',get_club_list,name='get_club_list'),
    path('join_club/<str:club_id>/',join_club,name='join_club'),
    path('leave_club/<str:club_id>/',leave_club,name='leave_club'),
    path('get_club_details/<str:club_id>/',get_club_details,name='get_club_details'),
    path('get_club_members/<str:club_id>/',get_club_members,name='get_club_members'),
    path('get_notifications/',get_notifications,name='get_notifications'),
    path('test/',test,name='testing_purpose')

]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)