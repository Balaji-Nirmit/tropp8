"""
ASGI config for backend project.

It exposes the ASGI callable as a module-level variable named ``application``.

For more information on this file, see
https://docs.djangoproject.com/en/5.1/howto/deployment/asgi/
"""

import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')

import django
django.setup()

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.security.websocket import AllowedHostsOriginValidator

# Import after Django setup
from notification.routing import websocket_urlpatterns
from notification.auth import JWTAuthMiddleware

application = ProtocolTypeRouter({
    'http': get_asgi_application(),
    'websocket': 
        AllowedHostsOriginValidator(  # Ensures WebSocket connections respect ALLOWED_HOSTS
            JWTAuthMiddleware(
                URLRouter(websocket_urlpatterns)
            )
        )
})
