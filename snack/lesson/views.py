from django.shortcuts import render, get_object_or_404
from .models import Lesson
from step.models import LESSON_METHODS


# lesson/<int:lesson_id>"
def lesson(request, lesson_id, step_id):
    obj_lesson = get_object_or_404(Lesson, pk=lesson_id)
    print('#', )
    # get step
    current_step = None
    steps = []

    for method_name in LESSON_METHODS:
        method = getattr(obj_lesson, method_name)
        for step in method.all():
            if step_id == step.order:
                current_step = step
            steps.append(step)
    if not current_step:
        current_step = steps[0]

    print('obj_lesson', obj_lesson)
    context = {
        'title': obj_lesson.name,
        'steps': steps,
        'current_step': current_step,
        'lesson_id': obj_lesson.id,
        'course_id': obj_lesson.get_course().id,
    }
    return render(request, "lesson/lesson.html", context)
