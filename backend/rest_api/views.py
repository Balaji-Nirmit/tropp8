from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

from .serializers import MyUserProfileSerializer, UserRegisterSerializer, PostSerializer, MyUserUpdateSerializer, FollowerFollowingSerializer, MyInstitutionSerializer, UserInstitutionSerializer, ClubSerializer,ClubListSerializer

from .models import MyUser,Post,PostImage,PostLike,Follower,FollowRequest, MyInstitution, UserInstitution, Club, ClubMember

from django.db.models import Count, Prefetch
from django.db import transaction

import uuid

from rest_framework.pagination import CursorPagination
from notification.models import Notification
from notification.consumers import send_notification
from asgiref.sync import async_to_sync
from notification.serializer import NotificationSerializer


class CustomTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        try:
            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens.get('access')
            refresh_token = tokens.get('refresh')
            username = request.data.get('username')

            if not username:
                return Response({'error': 'Username is required'}, status=status.HTTP_400_BAD_REQUEST)

            try:
                user = MyUser.objects.get(username=username)
            except MyUser.DoesNotExist:
                return Response({'error': 'User does not exist'}, status=status.HTTP_404_NOT_FOUND)

            res = Response({
                "success": True,
                "user": {
                    "username": user.username,
                    "bio": user.bio,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "profile_image": str(user.profile_image),
                    "isActive": user.isActive,
                    "isReported": user.isReported,
                    "isEmailVerified": user.isEmailVerified,
                    "isAccountVerified": user.isAccountVerified,
                    "isDirectFollow": user.isDirectFollow,
                    "created_at": user.created_at,
                    "banner_image":str(user.banner_image)
                }
            }, status=status.HTTP_200_OK)

            if access_token and refresh_token:
                res.set_cookie(
                    key='access_token',
                    value=access_token,
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/'
                )
                res.set_cookie(
                    key='refresh_token',
                    value=refresh_token,
                    httponly=True,
                    secure=True,
                    samesite='None',
                    path='/'
                )
            else:
                return Response({'error': 'Token generation failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return res

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CustomTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        try:
            refresh_token = request.COOKIES.get('refresh_token')

            if not refresh_token:
                return Response({'error': 'Refresh token missing'}, status=status.HTTP_401_UNAUTHORIZED)

            new_data = request.data.copy()  # Ensure immutability is handled
            new_data['refresh'] = refresh_token

            response = super().post(request, *args, **kwargs)
            tokens = response.data

            access_token = tokens.get('access')

            if not access_token:
                return Response({'error': 'Token refresh failed'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            res = Response({'success': True}, status=status.HTTP_200_OK)

            res.set_cookie(
                key='access_token',
                value=access_token,
                httponly=True,
                secure=True,
                samesite='None',
                path='/'
            )
            return res

        except Exception as e:
            return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class CustomCursorPagination(CursorPagination):
    """
    Custom cursor pagination that allows fetching posts in an efficient way.
    - Uses `created_at` as the cursor field by default.
    - Fetches a limited number of posts per request.
    - Ensures scalability for large datasets.
    """
    page_size = 2 # Fetch 10 posts at a time
    ordering = "-created_at"  # Default ordering (newest first)

    def get_paginated_response(self, data):
        """
        Customize the response to include extra metadata.
        """
        return Response({
            "next": self.get_next_link(),
            "previous": self.get_previous_link(),
            "results": data
        })


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def authenticated(request):
    return Response('authenticated')

@api_view(['POST'])
def register(request):
    serializer = UserRegisterSerializer(data=request.data)
    
    if serializer.is_valid():
        serializer.save() # Calls `create` method inside the serializer
        return Response({"success": True, "message": "User registered successfully!"}, status=status.HTTP_201_CREATED)

    return Response({"success": False, "message": "Registration failed!","errors":serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_posts(request):
    serializer = PostSerializer(data=request.data, context={"request": request})

    if serializer.is_valid():
        serializer.save()  # Calls `create` method inside the serializer
        return Response({"success": True, "message": "Post created successfully!"}, status=status.HTTP_201_CREATED)

    return Response({"success": False, "message": "Post creation failed!", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    res = Response({"success": True, "message": "Logged out successfully!"}, status=200)
    
    # Delete cookies
    res.delete_cookie('access_token', path='/', samesite='None')
    res.delete_cookie('refresh_token', path='/', samesite='None')
    
    return res

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request,username):
    """Fetches user profile with optimized follower/following counts."""
    try:
        user = (
            MyUser.objects.annotate(
                follower_count=Count('followers',distinct=True),
                following_count=Count('following',distinct=True),
            ).get(username=username)
        )
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    is_follower=Follower.objects.filter(follower=request.user,followed=user).exists()
    is_follow_request=FollowRequest.objects.filter(sender=request.user,receiver=user).exists()
    is_requested_me=FollowRequest.objects.filter(sender=user,receiver=request.user).exists()
    
    serializer = MyUserProfileSerializer(user, context={"request": request})
    return Response({"success": True, "user": serializer.data,"is_our_profile":request.user.username==user.username,"is_follower":is_follower,"is_follow_request":is_follow_request,"is_requested_me":is_requested_me}, status=status.HTTP_200_OK)
    
    

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_posts(request):
    my_user = request.user # Get the authenticated user
    paginator = CustomCursorPagination()
    posts = (
        Post.objects.select_related('user')
            .prefetch_related(
                Prefetch(
                    'likes',
                    queryset=PostLike.objects.only("post_id","user_id")
                    ),
                    "post_images")
            .annotate(like_count=Count('likes'))
            .only('id','user__username','description','created_at')
            .order_by('-created_at')
            )
    result_page = paginator.paginate_queryset(posts, request)
    liked_post_ids = (
        set(PostLike.objects.filter(user=my_user).values_list("post_id", flat=True).iterator())
    )
    serializer = PostSerializer(result_page, many=True, context={"request": request})

    data = [{**post, "liked_by_me": uuid.UUID(post["id"]) in liked_post_ids} for post in serializer.data]
    return paginator.get_paginated_response(data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_posts(request, username):
    """Fetch all posts of a specific user, optimized for scalability."""
    try:
        user = MyUser.objects.only('id').get(username=username)  # Efficient lookup using indexed `username`
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    paginator = CustomCursorPagination()

    posts = (
        Post.objects.filter(user=user)
        .select_related('user')
        .prefetch_related(
            Prefetch(
                'likes',
                queryset=PostLike.objects.only("post_id", "user_id")
            ),
            'post_images'
        )
        .annotate(like_count=Count('likes'))
        .only('id', 'user__username', 'description', 'created_at')
        .order_by('-created_at')
    )

    result_page = paginator.paginate_queryset(posts, request)

    liked_post_ids = (
        set(PostLike.objects.filter(user=request.user).values_list("post_id", flat=True).iterator())
    )
    # iterator avoids all data in memory and makes it memory efficient

    serializer = PostSerializer(result_page, many=True, context={"request": request})

    data = [{**post, "liked_by_me": uuid.UUID(post["id"]) in liked_post_ids} for post in serializer.data]

    return paginator.get_paginated_response(data)


@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def toggle_like(request,post_id):
    """
    Toggle like status for a given post.
    - If the post is already liked, it will be unliked.
    - If the post is not liked, it will be liked.
    """
    my_user = request.user
    try:
        post = Post.objects.get(id=post_id)  # Ensure post exists
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)
    
    with transaction.atomic():  # Ensure atomicity for scalability that is all db operations are executed as a single transaction inside this block
        like_obj, created = PostLike.objects.get_or_create(user=my_user, post=post)
        # get_or_create creates a new object if it does not exist, otherwise returns the existing object

        if created:
            # Like was added
            liked = True
        else:
            # Like exists, so remove it (Unlike)
            like_obj.delete()
            liked = False
    return Response({"success": True,"liked": liked}, status=status.HTTP_200_OK)

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def send_follow_request(request, username):
    """Send a follow request if the user requires approval, else follow directly."""
    sender = request.user

    try:
        receiver = MyUser.objects.get(username=username)
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    if sender == receiver:
        return Response({"error": "You cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)

    with transaction.atomic():
        if receiver.isDirectFollow:
            # Directly follow the user
            _, created = Follower.objects.get_or_create(follower=sender, followed=receiver)
            if created:
                return Response({"success": True, "message": f"You are now following {receiver.username}."}, status=status.HTTP_200_OK)
            return Response({"success": False, "message": "You are already following this user."}, status=status.HTTP_400_BAD_REQUEST)
        
        # Send follow request if not following directly
        follow_request, created = FollowRequest.objects.get_or_create(sender=sender, receiver=receiver)
        if created:
            notification = Notification.objects.create(
                sender=sender,
                receiver=receiver,
                 message=f"{sender.username} sent you a follow request",
                notification_types=1  # 1 corresponds to 'Follow_Request'
            )
            async_to_sync(send_notification)(receiver.username,receiver.profile_image,notification.message)
            return Response({"success": True, "message": f"Follow request sent to {receiver.username}."}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "Follow request already sent."}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_follow_requests(request):
    """Fetch all follow requests for the authenticated user."""
    paginator = CustomCursorPagination()
    follow_requests = (
        FollowRequest.objects.filter(receiver=request.user)
        .select_related('sender')
        .only("sender__username", "sender__profile_image","created_at")
    )

    result_page = paginator.paginate_queryset(follow_requests, request)
    serializer = FollowerFollowingSerializer(result_page, many=True, context={"request": request,"duty":"follow_request"})

    return paginator.get_paginated_response(serializer.data)

@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def accept_follow_request(request, username):
    """Accept a follow request and start following the user."""
    try:
        sender = MyUser.objects.get(username=username)
        follow_request = FollowRequest.objects.get(sender=sender, receiver=request.user)
    except (MyUser.DoesNotExist, FollowRequest.DoesNotExist):
        return Response({"error": "Follow request not found"}, status=status.HTTP_404_NOT_FOUND)

    with transaction.atomic():
        # Create Follower entry
        Follower.objects.get_or_create(follower=sender, followed=request.user)
        # Delete follow request
        follow_request.delete()

    return Response({"success": True, "message": f"Follow request from {username} accepted."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def reject_follow_request(request, username):
    """Reject a follow request."""
    try:
        sender = MyUser.objects.get(username=username)
        follow_request = FollowRequest.objects.get(sender=sender, receiver=request.user)
    except (MyUser.DoesNotExist, FollowRequest.DoesNotExist):
        return Response({"error": "Follow request not found"}, status=status.HTTP_404_NOT_FOUND)

    follow_request.delete()
    return Response({"success": True, "message": f"Follow request from {username} rejected."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def cancel_follow_request(request, username):
    """Cancel a follow request that was sent."""
    try:
        receiver = MyUser.objects.get(username=username)
        follow_request = FollowRequest.objects.get(sender=request.user, receiver=receiver)
    except (MyUser.DoesNotExist, FollowRequest.DoesNotExist):
        return Response({"error": "Follow request not found"}, status=status.HTTP_404_NOT_FOUND)

    follow_request.delete()
    return Response({"success": True, "message": f"Follow request to {username} canceled."}, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def unfollow_user(request, username):
    """ Unfollow a user (no request needed)."""
    try:
        followed_user = MyUser.objects.get(username=username)
        follow_entry = Follower.objects.get(follower=request.user, followed=followed_user)
    except (MyUser.DoesNotExist, Follower.DoesNotExist):
        return Response({"error": "You are not following this user"}, status=status.HTTP_400_BAD_REQUEST)

    follow_entry.delete()
    return Response({"success": True, "message": f"You have unfollowed {username}."}, status=status.HTTP_200_OK)


@api_view(['PATCH'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    """update user profile  - Excludes password from updates. -Supports partial updates.
    - Handles file uploads."""
    my_user=request.user
    data=request.data.copy()
    # making a copy since request.data is immutable
    for key, file in request.FILES.items():
        data[key] = file

    serializer = MyUserUpdateSerializer(my_user, data=data, partial=True, context={"request": request})  # Securely pass request context
    if serializer.is_valid():
        serializer.save()
        return Response({"success":True,"message":"Profile updated successfully!","user":serializer.data},status=status.HTTP_200_OK)
    return Response({"success":False,"message":"Profile update failed!","errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followers(request, username):
    """Fetch all followers of a specific user."""
    try:
        user = MyUser.objects.only("id").get(username=username)
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT)

    paginator = CustomCursorPagination()
    
    followers = (
        Follower.objects
        .filter(followed=user)
        .select_related('follower')  # Optimized for foreign key lookup
        .only("follower__username", "follower__profile_image","created_at")  # Fetch only required fields

    )

    result_page = paginator.paginate_queryset(followers, request)
    serializer = FollowerFollowingSerializer(result_page, many=True, context={"request": request,"duty":"follower"})

    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_followings(request, username):
    """Fetch all users that a specific user follows."""
    try:
        user = MyUser.objects.only("id").get(username=username)
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT)

    paginator = CustomCursorPagination()

    followings = (
        Follower.objects
        .filter(follower=user)
        .select_related('followed')  # Optimize the query
        .only("followed__username", "followed__profile_image","created_at")  # Fetch only required fields

    )

    result_page = paginator.paginate_queryset(followings, request)
    serializer = FollowerFollowingSerializer(result_page, many=True, context={"request": request,"duty":"following"})

    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_post_likes(request, post_id):
    """Fetch all users who liked a specific post."""
    try:
        post = Post.objects.only("id").get(id=post_id)
    except Post.DoesNotExist:
        return Response({"error": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

    paginator = CustomCursorPagination()

    liked_users = (
        PostLike.objects
        .filter(post=post)
        .select_related('user')  # Optimize the query
        .only("user__username", "user__profile_image","created_at")  # Fetch only required fields
    )

    result_page = paginator.paginate_queryset(liked_users, request)
    serializer = FollowerFollowingSerializer(result_page, many=True, context={"request": request,"duty":"liked"})
# context here is used to send certain information to serializer which has to be made available to the serializer
    return paginator.get_paginated_response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def institution_list(request):
    """List all institutions (scalable for search & filtering)"""
    institutions = MyInstitution.objects.all()
    serializer = MyInstitutionSerializer(institutions, many=True)
    return Response(serializer.data)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def user_education_list_create(request):
    """Fetch and add user educational institutions"""
    if request.method == 'GET':
        institutions = UserInstitution.objects.filter(user=request.user)
        serializer = UserInstitutionSerializer(institutions, many=True)
        return Response({"success": True, "education": serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'POST':
        serializer = UserInstitutionSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response({"success": True, "message": "Education data created successfully!"}, status=status.HTTP_201_CREATED)
        return Response({"success": False, "message": "Education data creation failed!", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET', 'PATCH', 'DELETE'])
@permission_classes([IsAuthenticated])
def user_education_detail(request, education_detail_id):
    """Retrieve, partially update, or delete a user educational record"""
    try:
        education = UserInstitution.objects.get(id=education_detail_id)
    except UserInstitution.DoesNotExist:
        return Response({"error": "User education data not found"}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'GET':
        serializer = UserInstitutionSerializer(education)
        return Response({"success": True, "education": serializer.data}, status=status.HTTP_200_OK)

    elif request.method == 'PATCH':  # Partial Update
        serializer = UserInstitutionSerializer(education, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response({"success":True,"message":"Education updated successfully!","education":serializer.data},status=status.HTTP_200_OK)
        return Response({"success":False,"message":"Education update failed!","errors":serializer.errors},status=status.HTTP_400_BAD_REQUEST)


    elif request.method == 'DELETE':
        education.delete()
        return Response({"message": "Education record deleted successfully"}, status=status.HTTP_204_NO_CONTENT)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_education_detail(request,username):
    try:
        user = MyUser.objects.only("id").get(username=username)
    except MyUser.DoesNotExist:
        return Response({"error": "User not found"}, status=status.HTTP_404_NOT)
    
    education = UserInstitution.objects.filter(user=user)
    serializer = UserInstitutionSerializer(education,many=True)
    return Response({"success": True, "education": serializer.data}, status=status.HTTP_200_OK)

# clubs

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_club(request):
    my_user = request.user

    # Check if the user already owns a club
    if Club.objects.filter(owner=my_user).exists():
        return Response(
            {"success": False, "message": "You can only create one club."},
            status=status.HTTP_400_BAD_REQUEST
        )

    data = request.data.copy()  # Making a mutable copy
    for key, file in request.FILES.items():
        data[key] = file
    print(data)

    serializer = ClubSerializer(data=data, context={'request': request})
    if serializer.is_valid():
        serializer.save()  
        return Response({"success": True, "message": "Club created successfully!"}, status=status.HTTP_201_CREATED)
    
    return Response({"success": False, "message": "Club creation failed!", "errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def join_club(request,club_id):
    """Join a club if not already a member."""
    my_user=request.user

    try:
        club= Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND) 

    with transaction.atomic():
        _,created = ClubMember.objects.get_or_create(follower=my_user,club=club)
        if created:
            return Response({"success": True, "message": f"You are now member {club.name}."}, status=status.HTTP_200_OK)
        return Response({"success": False, "message": "You are already member this club."}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['POST','GET'])
@permission_classes([IsAuthenticated])
def leave_club(request,club_id):
    """Leave a club if already a member."""
    my_user=request.user

    try:
        club= Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND) 

    try:
        member= ClubMember.objects.get(follower=my_user,club=club)
    except ClubMember.DoesNotExist:
        return Response({"error": "You are not member of this club"}, status=status.HTTP_400_BAD_REQUEST) 

    member.delete()
    return Response({"success": True, "message": f"You have left {club.name}."}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_list(request):
    """Fetch all clubs."""
    paginator = CustomCursorPagination()
    clubs = Club.objects.all()
    result_page = paginator.paginate_queryset(clubs, request)
    serializer = ClubListSerializer(result_page, many=True, context={"request": request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_details(request,club_id):
    """Fetch club details."""
    try:
        club = Club.objects.annotate(
            follower_count=Count('Clubs',distinct=True)
        ).get(id=club_id)
        # Clubs related name for getting all clubs in ClubMember model
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)
    
    member_of_club = ClubMember.objects.filter(follower=request.user,club=club).exists()
    

    serializer = ClubSerializer(club, context={"request": request})
    return Response({"success": True, "user": serializer.data,"is_my_club":request.user.username==club.owner.username,"member_of_club":member_of_club}, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_club_members(request,club_id):
    """Fetch all members of a specific club."""
    try:
        club = Club.objects.get(id=club_id)
    except Club.DoesNotExist:
        return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

    paginator = CustomCursorPagination()

    members = (
        ClubMember.objects
        .filter(club=club)
        .select_related('follower')  # Optimize the query with follower field of clubMember
        .only("follower__username", "follower__profile_image","created_at")  # Fetch only required fields
    )

    result_page = paginator.paginate_queryset(members, request)
    serializer = FollowerFollowingSerializer(result_page, many=True, context={"request": request,"duty":"club_member"})

    return paginator.get_paginated_response(serializer.data)  


# notification
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_notifications(request):
    user=request.user
    paginator = CustomCursorPagination()
    notifications_data = (
        Notification.objects
        .filter(receiver=user)
        .select_related('sender')
        .only('id','sender','receiver','message','is_read','created_at','notification_types',"sender__profile_image")
    )
    result_page=paginator.paginate_queryset(notifications_data,request)
    serializer=NotificationSerializer(result_page,many=True,context={"request":request})
    return paginator.get_paginated_response(serializer.data)

@api_view(['GET'])
def test(request):
    # async_to_sync coz views are synchronous and send_notification method is asynchronous
    async_to_sync(send_notification)('jinwoo', 'blakyblaky', True)
    return Response('notification sent')
