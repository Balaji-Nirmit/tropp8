import uuid
from django.contrib.auth.models import AbstractUser
from django.db import models

class MyUser(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=50, unique=True, db_index=True)
    email = models.EmailField(unique=True, db_index=True)
    registration = models.CharField(max_length=11, db_index=True)
    bio = models.TextField(blank=True, help_text="User bio")
    profile_image = models.ImageField(upload_to='profile_image/', blank=True, null=True)
    banner_image = models.ImageField(upload_to='banner_images/', blank=True, null=True)

    isEmailVerified = models.BooleanField(default=False, db_index=True)
    isAccountVerified = models.BooleanField(default=False, db_index=True)
    isReported = models.BooleanField(default=False, db_index=True)
    isActive = models.BooleanField(default=True, db_index=True)
    isDirectFollow = models.BooleanField(default=False, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True,null=True)

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        indexes = [
            models.Index(fields=['username']),
            models.Index(fields=['registration']),
            models.Index(fields=['isReported']),
        ]

    def __str__(self):
        return self.username

class Follower(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    follower = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='following')
    followed = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='followers')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['follower', 'followed'], name="unique_follow")
        ]

    def __str__(self):
        return f"{self.follower} follows {self.followed}"

class Post(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(
        MyUser, on_delete=models.CASCADE, related_name='posts',
        verbose_name="Author", help_text="User who created the post"
    )
    description = models.TextField(
        verbose_name="Description", help_text="Content of the post"
    )
    created_at = models.DateTimeField(
        auto_now_add=True, db_index=True, verbose_name="Created At"
    )
    isReported = models.BooleanField(
        default=False, db_index=True, verbose_name="Reported",
        help_text="Mark as reported if flagged by users"
    )

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['isReported']),
        ]

    def __str__(self):
        return f"Post {self.id} by {self.user}"

class PostLike(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="likes")
    user = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name="liked_posts")
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['post', 'user'], name="unique_post_like")
        ]
        indexes = [
            models.Index(fields=['user']),
        ]

    def __str__(self):
        return f"{self.user} liked Post {self.post.id}"

class PostImage(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name="post_images")
    image = models.ImageField(upload_to='post_image/', blank=False, null=False)

    class Meta:
        ordering = ['-post__created_at']

    def __str__(self):
        return f"Post {self.post.id} - {self.image.url if self.image else 'No Image'}"
    
class FollowRequest(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='sent_follow_requests')
    receiver = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='received_follow_requests')
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)

    class Meta:
        ordering = ['-created_at']
        constraints = [
            models.UniqueConstraint(fields=['sender', 'receiver'], name="unique_follow_request")
        ]
        indexes = [
            models.Index(fields=['receiver']),
            models.Index(fields=['sender']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.sender} → {self.receiver} (Follow Request)"

