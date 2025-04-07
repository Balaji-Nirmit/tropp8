from django.db import models
import uuid
# Create your models here.
class Notification(models.Model):
    class NotificationType(models.IntegerChoices):
        FOLLOW_REQUEST = 1, 'Follow Request'
        LIKE = 2, 'Like'
        COMMENT = 3, 'Comment'
        CLUB_POST = 4, 'Club Post'

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    sender = models.ForeignKey('rest_api.MyUser', on_delete=models.CASCADE, related_name='notification_sender',db_index=True)
    receiver  = models.ForeignKey('rest_api.MyUser',on_delete=models.CASCADE,related_name='notification_receiver',db_index=True)
    message = models.CharField(max_length=100)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    is_read = models.BooleanField(default=False)
    notification_types = models.IntegerField(choices=NotificationType.choices, null=True, blank=True)


    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['created_at']),
            models.Index(fields=['is_read']),
        ]
    def __str__(self):
        return f"Notification {self.id} from {self.sender} to {self.receiver}"
