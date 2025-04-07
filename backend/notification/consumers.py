import json
from channels.generic.websocket import AsyncWebsocketConsumer
from .models import Notification

class NotificationConsumer(AsyncWebsocketConsumer):
    """WebSocket Consumer for real-time notifications"""

    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_authenticated:
            self.group_name = f"notifications_{self.user.username}"
            print(self.group_name)
            await self.channel_layer.group_add(self.group_name, self.channel_name)
            await self.accept()
        else:
            await self.close()  # Reject the connection if unauthenticated

    async def disconnect(self, close_code):
        if self.user.is_authenticated:
            await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def send_notification(self, event):
        """Send a notification message"""
        message = event["message"]
        print("sending*****************")
        await self.send(text_data=json.dumps({
            "message": message,
            "username": event["user_id"],
            "profile_image": event["profile_image"]
        }))

    async def receive(self, text_data):
        """Handle received WebSocket messages"""
        data = json.loads(text_data)
        action = data.get("action")
        print("received**********",action)

        if action == "mark_as_read":
            notification_id = data.get("notification_id")
            await self.mark_notification_as_read(notification_id)

    async def mark_notification_as_read(self, notification_id):
        """Mark a notification as read"""
        try:
            notification = await Notification.objects.aget(id=notification_id, receiver=self.user)
            # aget is asynchronous version of get
            notification.is_read = True
            await notification.asave(update_fields=["is_read"])
        except Notification.DoesNotExist:
            await self.send(text_data=json.dumps({
                "status": "error",
                "message": "Notification not found"
            }))

async def send_notification(user_id, profile_image, message):
    """Send notification to a specific user"""
    from channels.layers import get_channel_layer
    channel_layer = get_channel_layer()
    print("started------with",user_id)
    await channel_layer.group_send(
        f"notifications_{user_id}",
        {"type": "send_notification", "message": message, "user_id": user_id, "profile_image": profile_image},
    )
    print("notification sent")
