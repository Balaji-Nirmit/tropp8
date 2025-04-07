
staring with the project we need to create a virtual environment 
```bash
python3 -m venv venv
```
this will create a virtual environment folder env
```bash
source venv/bin/activate
```
this to activate virtual environment in mac 
and for windows
```bash
vevn/Scripts/Activate
```

# setting up the backend

```bash
pip3 install django
```

```bash
pip3 install djangorestframework
```

```bash
pip3 install django-cors-headers
```

```
django-admin startproject backend
cd backend
python3 manage.py startapp base
```

```py
pip install -r requirements.txt
```
this is for requirements.txt
# setting up the settings file 

- configure INSTALLED_APPS
- MIDDLEWARE 
- CORS_ALLOWED_ORIGIN
- CORS ALLOW CREDENTIALS
- MEDIA_URL
- MEDIA ROOT


add a urls.py in base folder and then include it in the urls.py file of the backend folder


```bash
npm create vite@latest
```
say project frontend is created 
change directory to that folder
```bash
npm install
```
```bash
npm install axios
```
```bash
npm install react-router-dom
```
# setting up tailwind css
```bash
npm install tailwindcss @tailwindcss/vite
```
make vite.config.js like this i.e. include tailwindcss into plugins
```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
})
```
now remove every thing from index.css and include
@import 'tailwindcss';

```bash
npm install react-icons
```
# authentication using JWT token

in backend
```bash
pip install djangorestframework-simplejwt
```
include rest_framework_simplejwt in INSTALLED_APPS of settings.py
```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}
```
include this also in settings.py

```bash
# simplejwt calls userid bydefault for user model so we need to change it to username since in our app username is the primary key
SIMPLE_JWT={
    "USER_ID_FIELD":"username",
}
```
this also

this is urls.py in base

```py
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views import get_user_profile_data

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns=[
    path('user_data/<str:pk>/',get_user_profile_data,name='user_data'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
```

### customizing the token classes

```bash
from django.urls import path

from django.conf import settings
from django.conf.urls.static import static

from .views import get_user_profile_data,CustomTokenObtainPairView,CustomTokenRefreshView

urlpatterns=[
    path('user_data/<str:pk>/',get_user_profile_data,name='user_data'),
    path('token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CustomTokenRefreshView.as_view(), name='token_refresh'),
]+static(settings.MEDIA_URL,document_root=settings.MEDIA_ROOT)
```
check views.py for custom code


now making our custom authentication using cooking
make authenticate.py in base 
```py
from rest_framework_simplejwt.authentication import JWTAuthentication

class CustomCookieAuthentication(JWTAuthentication):
    def authenticate(self, request):
        access_token=request.COOKIES.get('access_token')
        if not access_token:
            return None
        validated_token=self.get_validated_token(access_token)
        try:
            user=self.get_user(validated_token)
        except:
            return None
        return (user,validated_token)
```

change settings.py default authentication class

```py
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'base.authenticate.CustomCookieAuthentication',
    )
}
```

# making protected routes
we will be using react redux toolkit for this

create view authenticated which has permission class as IsAuthenticated
and then make stores --

```bash
npm install @reduxjs/toolkit react-redux
```

make a store
storeIndex.js
authSlice.js
in a store folder
after that make a protectedRoute component in components folder

also need to provide the store in main.jsx

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import storeIndex from './store/storeIndex.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={storeIndex}><App /></Provider>
  </StrictMode>,
)
```



# infinite scroll
```bash
npm install react-intersection-observer
```
Instead of listening to scroll events, we use the Intersection Observer API via the react-intersection-observer library. This method detects when the last post is visible on screen and triggers the next data fetch.

+ Create a ref for the last element in the post list.
+ Check when it comes into view using useInView().
+ Trigger fetchData() whenever the last element is visible.
+ Append new posts to the existing list.

# Notification system 
```
pip install channels daphne
pip install django-channels-jwt-auth-middleware
```
