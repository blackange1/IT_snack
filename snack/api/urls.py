from django.urls import path

from .views import CourseList, CourseDetail, ModuleDetail, StepMenu

from .views_lessons_text import StepTextItem
from .views_lessons_choice import StepChoice
from .views_lessons_choice_multi import StepChoiceMulti
from .views_lessons_code import StepCode
from .views_lessons_result import ResultLesson


urlpatterns = [
    # ex: /api/
    path("courses/", CourseList.as_view(), name="courses_list"),
    path("courses/<int:course_id>/", CourseDetail.as_view(), name="courses_detail"),
    path("modules/<int:module_id>/", ModuleDetail.as_view(), name="module_detail"),
    path("step-menu/<int:lesson_id>/", StepMenu.as_view(), name="steps_menu"),
    # path("step-item/<slug:step_type>/<int:step_id>/", StepItem.as_view(), name="steps_item"),

    # views_lessons
    path("step-item/text/<int:step_id>/", StepTextItem.as_view(), name="steps_text"),
    path("step-item/choice/<int:step_id>/", StepChoice.as_view(), name="steps_choice"),
    path("step-item/choice_multi/<int:step_id>/", StepChoiceMulti.as_view(), name="steps_choice_multi"),
    path("step-item/code/<int:step_id>/", StepCode.as_view(), name="steps_code"),
    # path("test/", Test.as_view(), name="test"),

    path("result/lesson/<int:lesson_id>/", ResultLesson.as_view(), name="result_lesson"),
]
