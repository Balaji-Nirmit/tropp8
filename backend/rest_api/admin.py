from django.contrib import admin
from .models import MyUser, Follower, Post, PostLike, PostImage, FollowRequest, MyInstitution, UserInstitution, Club, ClubMember

# Register your models here.
admin.site.register(MyUser)
admin.site.register(Follower)
admin.site.register(Post)
admin.site.register(PostLike)
admin.site.register(PostImage)
admin.site.register(FollowRequest)
admin.site.register(MyInstitution)
admin.site.register(UserInstitution)
admin.site.register(Club)
admin.site.register(ClubMember)