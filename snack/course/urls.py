from django.urls import path

from . import views

urlpatterns = [
    # ex: /course/
    path("", views.course, name="course"),
    path("<int:course_id>/syllabus/", views.syllabus, name="syllabus"),
    path("<int:course_id>/edit/", views.syllabus_edit, name="syllabus_edit"),
]
