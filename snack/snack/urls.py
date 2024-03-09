"""
URL configuration for snack project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include
# from rest_framework_simplejwt import views as jwt_views

admin.site.site_header = "IT SNACK Admin"
admin.site.site_title = "IT SNACK Admin Portal"
admin.site.index_title = "Welcome to IT SNACK Researcher Portal"

urlpatterns = [
    # path('tetra/', include('tetra.urls')),

    path('', include('core.urls')),
    path('api/', include('api.urls')),
    path('course/', include('course.urls')),
    path('', include('lesson.urls')),
    path('admin/', admin.site.urls),
    path('accounts/', include('django.contrib.auth.urls')),

]
print('settings.STATIC_ROOT', settings.STATIC_ROOT)
