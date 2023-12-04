from django.urls import path

from .views import CourseList, CourseDetail, ModuleDetail, StepMenu

urlpatterns = [
    # ex: /api/
    path("courses/", CourseList.as_view(), name="courses_list"),
    path("courses/<int:course_id>/", CourseDetail.as_view(), name="courses_detail"),
    path("modules/<int:module_id>/", ModuleDetail.as_view(), name="module_detail"),
    path("step-menu/<int:lesson_id>/", StepMenu.as_view(), name="steps_menu"),
]
