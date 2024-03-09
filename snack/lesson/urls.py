from django.urls import path

from . import views

urlpatterns = [
    # ex: /
    path("lesson/<int:lesson_id>/step/<int:step_id>", views.lessons, name="lessons"),
    path("edit-lesson/<int:lesson_id>/step/<int:current_step>", views.edit_lessons, name="edit_lessons"),
]
