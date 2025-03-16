from rest_framework import serializers
from .models import MyUser, Post, PostImage, PostLike, FollowRequest, Follower

class MyUserProfileSerializer(serializers.ModelSerializer):
    follower_count=serializers.IntegerField(read_only=True)
    following_count=serializers.IntegerField(read_only=True)
    profile_image = serializers.SerializerMethodField()
    banner_image = serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField()

    # since these are computed values then it is good practice to use read_only=True
    class Meta:
        model=MyUser
        fields=['username','registration','bio','profile_image','banner_image','follower_count','following_count','isEmailVerified','isAccountVerified','isReported','isActive','isDirectFollow',"created_date"]
        extra_kwargs = {
            "isReported": {"read_only": True},
            "isActive": {"read_only": True},
            "isAccountVerified": {"read_only": True}
        }
    
    def get_profile_image(self, obj):
        return self.get_image_url(obj.profile_image)

    def get_banner_image(self, obj):
        return self.get_image_url(obj.banner_image)
    
    def get_created_date(self, obj):
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else None

    def get_image_url(self, image_field):
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{image_field.url}") if request else f"/api{image_field.url}") if image_field else None

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = MyUser
        fields = ['username', 'email', 'first_name', 'last_name', 'password']

    def validate_username(self, value):
        """Check if the username already exists (optimized for large datasets)."""
        if MyUser.objects.filter(username=value).only('id').exists():
            raise serializers.ValidationError("This username is already taken. Please choose another.")
        return value

    def validate_email(self, value):
        """Check if the email already exists (optimized for large datasets)."""
        if MyUser.objects.filter(email=value).only('id').exists():
            raise serializers.ValidationError("This email is already registered. Please use a different one.")
        return value

    def create(self, validated_data):
        user = MyUser(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class PostImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()
    image_name = serializers.SerializerMethodField()  

    class Meta:
        model = PostImage
        fields = ["id", "image_name", "image_url"]

    def get_image_url(self, obj):
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{obj.image.url}") if request else f"/api{obj.image.url}") if obj.image else None

    def get_image_name(self, obj):
        return obj.image.name.split("/")[-1] if obj.image else None


class PostSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    like_count = serializers.IntegerField(read_only=True)  # Precomputed for efficiency
    formatted_date = serializers.SerializerMethodField()
    images = PostImageSerializer(many=True, read_only=True, source="post_images")
    image_files = serializers.ListField(child=serializers.ImageField(), write_only=True, required=False)

    class Meta:
        model = Post
        fields = ['id', 'username', 'description', 'like_count', 'formatted_date', 'images', 'image_files']

    def get_username(self, obj):
        return obj.user.username

    def get_formatted_date(self, obj):
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else None

    def create(self, validated_data):
        """
        Creates a post with multiple images.
        """
        image_files = validated_data.pop('image_files', [])  # Extract images
        user = self.context['request'].user  # Get the logged-in user

        post = Post.objects.create(user=user, **validated_data)  # Create post

        # If images are provided, save them in bulk
        if image_files:
            post_images = [PostImage(post=post, image=image) for image in image_files]
            PostImage.objects.bulk_create(post_images)

        return post  # Return the post object but will not be returned in the response

class MyUserUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = MyUser
        fields = (
            "bio",
            "profile_image",
            "banner_image",
            "first_name",
            "last_name",
        )
        extra_kwargs = {
            "profile_image": {"required": False},
            "banner_image": {"required": False},
        }

class FollowerFollowingSerializer(serializers.Serializer):
    """Serializer for returning only username & profile image."""
    username = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()

    def get_username(self, obj):
        if self.context.get("duty")=="follower":
            return obj.follower.username
        elif self.context.get("duty")=="following":
            return obj.followed.username
        elif self.context.get("duty")=="liked":
            return obj.user.username

    def get_profile_image(self, obj):
        """Dynamically get profile image URL from a tuple (username, profile_image)."""
        if self.context.get("duty")=="follower":
            profile_image = obj.follower.profile_image 
        elif self.context.get("duty")=="following":
            profile_image = obj.followed.profile_image 
        elif self.context.get("duty")=="liked":
            profile_image = obj.user.profile_image 
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{profile_image.url}") if request else f"/api{profile_image.url}") if profile_image else None
        

