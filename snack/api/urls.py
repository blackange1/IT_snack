from django.urls import path

from .views import CourseList, CourseDetail, ModuleDetail, StepMenu, \
    StepTextItem, StepChoice, Test

urlpatterns = [
    # ex: /api/
    path("courses/", CourseList.as_view(), name="courses_list"),
    path("courses/<int:course_id>/", CourseDetail.as_view(), name="courses_detail"),
    path("modules/<int:module_id>/", ModuleDetail.as_view(), name="module_detail"),
    path("step-menu/<int:lesson_id>/", StepMenu.as_view(), name="steps_menu"),
    # path("step-item/<slug:step_type>/<int:step_id>/", StepItem.as_view(), name="steps_item"),
    path("step-item/text/<int:step_id>/", StepTextItem.as_view(), name="steps_text"),
    path("step-item/choice/<int:step_id>/", StepChoice.as_view(), name="steps_choice"),
    path("test/", Test.as_view(), name="test"),
]
