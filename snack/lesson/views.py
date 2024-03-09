from django.shortcuts import render, get_object_or_404, redirect
from .models import Lesson
from step.models import LESSON_METHODS


# lesson/<int:lesson_id>"
def lessons(request, lesson_id, step_id):
    if not request.user.is_authenticated:
        return redirect('login')
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    course = lesson.module.course
    print('#', lesson.module.course.name)
    # get step
    current_step = None
    # steps = []

    # for method_name in LESSON_METHODS:
    #     method = getattr(lesson, method_name)
    #     for step in method.all():
    #         if step_id == step.order:
    #             current_step = step
    #         steps.append(step)
    # if not current_step:
    #     current_step = steps[0]

    print('lesson', lesson)
    context = {
        "course_title": course.name,
        "course_id": course.pk,
        # 'title': lesson.name,
        # 'steps': steps,
        'current_step': current_step,
        'lesson_id': lesson.id,
        # 'course_id': lesson.get_course().id,
    }
    return render(request, "lesson/lesson.html", context)


def edit_lessons(request, lesson_id, step_id):
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    print('lesson', lesson)
    context = {}
    return render(request, "lesson/edit_lesson.html", context)
