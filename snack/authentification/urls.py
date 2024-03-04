from django.urls import path

from . import views

urlpatterns = [
    # ex: /lesson/
    path('home/', views.HomeView.as_view(), name='home'),
    path('logout/', views.LogoutView.as_view(), name='logout')
]
