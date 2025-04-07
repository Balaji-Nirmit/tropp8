import jwt
from django.contrib.auth import get_user_model
from django.contrib.auth.models import AnonymousUser
from django.conf import settings
from urllib.parse import parse_qs
from channels.db import database_sync_to_async

User = get_user_model()

class JWTAuthMiddlewareClass:
    """
    Custom WebSocket authentication middleware using JWT tokens from cookies.
    """

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):
        # Extract JWT token from cookies
        headers = dict(scope["headers"])
        cookie_header = headers.get(b"cookie", b"").decode()
        
        # Parse cookies
        cookies = {cookie.split("=")[0]: cookie.split("=")[1] for cookie in cookie_header.split("; ")}
        access_token = cookies.get("access_token")
        if access_token:
            try:
                # Decode JWT token
                decoded_data = jwt.decode(access_token, settings.SECRET_KEY, algorithms=["HS256"])
                user_id = decoded_data.get("user_id")

                if user_id:
                    user = await self.get_user(user_id)
                    scope["user"] = user
            except jwt.ExpiredSignatureError:
                print("Token has expired")
                scope["user"] = AnonymousUser()
            except jwt.InvalidTokenError:
                print("Invalid token")
                scope["user"] = AnonymousUser()
        else:
            scope["user"] = AnonymousUser()

        return await self.inner(scope, receive, send)

    @database_sync_to_async
    def get_user(self, user_id):
        """Fetch user from the database asynchronously."""
        try:
            return User.objects.get(username=user_id)
        except User.DoesNotExist:
            return AnonymousUser()

# Middleware Stack Wrapper
def JWTAuthMiddleware(inner):
    return JWTAuthMiddlewareClass(inner)
