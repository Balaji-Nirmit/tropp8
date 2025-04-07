from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender_username=serializers.SerializerMethodField()
    receiver_username=serializers.SerializerMethodField()
    created_date = serializers.SerializerMethodField()
    profile_image = serializers.SerializerMethodField()
    class Meta:
        model=Notification
        fields=['id','sender_username','receiver_username','message','is_read','created_date','notification_types','profile_image']
    
    def get_sender_username(self,obj):
        return obj.sender.username
    
    def get_receiver_username(self,obj):
        return obj.receiver.username
    
    def get_created_date(self, obj):
        return obj.created_at.strftime("%d %b %Y") if obj.created_at else None
    
    def get_profile_image(self, obj):
        return self.get_image_url(obj.sender.profile_image)
    
    def get_image_url(self, image_field):
        request = self.context.get("request")
        return (request.build_absolute_uri(f"/api{image_field.url}") if request else f"/api{image_field.url}") if image_field else None

# if certain field are missing in only () of the view and then they are asked in serializer then no error due to lazy loading as django will again fetch those from ORM.