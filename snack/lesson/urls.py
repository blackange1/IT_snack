from django.urls import path

from . import views

urlpatterns = [
    # ex: /lesson/
    path("<int:lesson_id>/step/<int:step_id>", views.lessons, name="lessons"),
]
