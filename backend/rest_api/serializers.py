from rest_framework import serializers
from .models import MyUser, Post, PostImage, PostLike, FollowRequest, Follower, MyInstitution, UserInstitution, Club, ClubMember

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
    
    def to_representation(self, instance):
        """Modify the representation of profile_image & banner_image to return filenames instead of URLs."""
        data = super().to_representation(instance)
        if instance.profile_image:
            data["profile_image"] = instance.profile_image.name  # Returns only filename
        if instance.banner_image:
            data["banner_image"] = instance.banner_image.name  # Returns only filename
        return data

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
        elif self.context.get("duty")=="club_member":
            return obj.follower.username
        elif self.context.get("duty")=="follow_request":
            return obj.sender.username

    def get_profile_image(self, obj):
        """Dynamically get profile image URL from a tuple (username, profile_image)."""
        if self.context.get("duty")=="follower":
            profile_image = obj.follower.profile_image 
        elif self.context.get("duty")=="following":
            profile_image = obj.followed.profile_image 
        elif self.context.get("duty")=="liked":
            profile_image = obj.user.profile_image 
        elif self.context.get("duty")=="club_member":
            profile_image = obj.follower.profile_image
        elif self.context.get("duty")=="follow_request":
            profile_image = obj.sender.profile_image
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{profile_image.url}") if request else f"/api{profile_image.url}") if profile_image else None
        
class MyInstitutionSerializer(serializers.ModelSerializer):
    """Serializer for fetching institutions"""
    class Meta:
        model = MyInstitution
        fields = ['id','name','city','country','website']

class UserInstitutionSerializer(serializers.ModelSerializer):
    """Serializer for fetching and adding user educational institutions"""

    institution = MyInstitutionSerializer(read_only=True)  # Fetch institution details
    institution_name = serializers.CharField(write_only=True, required=False)  # Required only for creation
    start_date = serializers.DateTimeField(format="%Y-%m", input_formats=["%Y-%m"], required=True)
    end_date = serializers.DateTimeField(format="%Y-%m", input_formats=["%Y-%m"], required=False, allow_null=True)

    class Meta:
        model = UserInstitution
        fields = ['id', 'user', 'institution', 'institution_name', 'degree', 'start_date', 'end_date', 'is_current']
        extra_kwargs = {'user': {'read_only': True}}

    def validate(self, data):
        """Ensure end_date is after start_date and validate institution name only for creation"""
        
        # Only enforce institution_name for creation
        if self.instance is None and not data.get("institution_name"):
            raise serializers.ValidationError({"institution_name": "Institution name is required."})

        # Validate dates
        start_date = data.get('start_date', self.instance.start_date if self.instance else None)
        end_date = data.get('end_date', self.instance.end_date if self.instance else None)

        if start_date and end_date and start_date > end_date:
            raise serializers.ValidationError({"end_date": "End date must be after start date."})

        return data

    def create(self, validated_data):
        """Create or get an institution and associate it with a UserInstitution"""
        institution_name = validated_data.pop("institution_name").strip()
        
        # Case-insensitive lookup for existing institutions
        institution, _ = MyInstitution.objects.get_or_create(name__iexact=institution_name, defaults={"name": institution_name})
        
        validated_data['institution'] = institution
        return UserInstitution.objects.create(**validated_data)

    def update(self, instance, validated_data):
        """Update UserInstitution, only modifying institution if provided"""
        
        institution_name = validated_data.pop("institution_name", None)

        # Only update institution if a new name is explicitly provided
        if institution_name:
            institution = MyInstitution.objects.filter(name__iexact=institution_name).first()
            if not institution:
                institution = MyInstitution.objects.create(name=institution_name)
            instance.institution = institution

        # Update other fields
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance


class ClubSerializer(serializers.ModelSerializer):
    username = serializers.SerializerMethodField()
    institution = MyInstitutionSerializer(read_only=True)  # Send institution details
    institution_name = serializers.CharField(write_only=True, required=False)  # Accept institution name in request
    profile_image = serializers.ImageField(required=False, allow_null=True, write_only=True)  # Allow image upload
    banner_image = serializers.ImageField(required=False, allow_null=True, write_only=True)
    profile_image_url = serializers.SerializerMethodField(read_only=True)  # Send image as URL
    banner_image_url = serializers.SerializerMethodField(read_only=True)
    created_date = serializers.SerializerMethodField()
    follower_count = serializers.IntegerField(read_only=True)  # Computed field

    class Meta:
        model = Club
        fields = [
            'id', 'name', 'description', 'username', 'institution', 'institution_name',
            'profile_image', 'profile_image_url', 'banner_image', 'banner_image_url',
            'follower_count', 'created_date'
        ]
        extra_kwargs = {
            "owner": {"read_only": True},  
            "created_date": {"read_only": True},  
            "follower_count": {"read_only": True},  
        }

    def get_username(self, obj):
        return obj.owner.username
    
    def get_profile_image_url(self, obj):
        """Returns the absolute URL of the profile image"""
        return self.get_image_url(obj.profile_image)

    def get_banner_image_url(self, obj):
        """Returns the absolute URL of the banner image"""
        return self.get_image_url(obj.banner_image)

    def get_created_date(self, obj):
        """Formats the creation date"""
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else None

    def get_image_url(self, image_field):
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{image_field.url}") if request else f"/api{image_field.url}") if image_field else None

    def create(self, validated_data):
        """Ensure institution is correctly linked and save images"""
        institution_name = validated_data.pop("institution_name", None)
        user = self.context["request"].user  # Get the logged-in user

        # If institution_name is given, fetch institution object
        if institution_name:
            try:
                institution = MyInstitution.objects.get(name=institution_name)
                validated_data["institution"] = institution
            except MyInstitution.DoesNotExist:
                raise serializers.ValidationError({"institution_name": "Invalid institution"})

        # Create the club with the provided data
        club = Club.objects.create(owner=user, **validated_data)
        return club



class ClubListSerializer(serializers.ModelSerializer):
    institution = MyInstitutionSerializer(read_only=True)  # Send institution details
    profile_image_url = serializers.SerializerMethodField(read_only=True)  # Send image as URL
    banner_image_url = serializers.SerializerMethodField(read_only=True)
    created_date = serializers.SerializerMethodField()

    class Meta:
        model = Club
        fields = [
            'id', 'name', 'description', 'owner', 'institution',
            'profile_image_url', 'banner_image_url', 'created_date'
        ]  # ⚠️ No 'follower_count' included

    def get_profile_image_url(self, obj):
        """Returns the absolute URL of the profile image"""
        return self.get_image_url(obj.profile_image)

    def get_banner_image_url(self, obj):
        """Returns the absolute URL of the banner image"""
        return self.get_image_url(obj.banner_image)

    def get_created_date(self, obj):
        """Formats the creation date"""
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else None

    def get_image_url(self, image_field):
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{image_field.url}") if request else f"/api{image_field.url}") if image_field else None
