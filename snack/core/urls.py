from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("urls/", views.urls, name="urls"),
    path("teach/courses", views.teach_courses, name="teach_courses"),
    # path("edit-course/<int:course_id>/", views.edit_course, name="edit_course"),
]
