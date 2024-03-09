from django.shortcuts import render, get_object_or_404, redirect

from .models import Lesson


# lesson/<int:lesson_id>"
def lessons(request, lesson_id, step_id):
    if not request.user.is_authenticated:
        return redirect('login')
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    course = lesson.module.course
    print('#', lesson.module.course.name)
    # get step
    # current_step = None
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
        # 'current_step': current_step,
        'lesson_id': lesson.id,
        # 'course_id': lesson.get_course().id,
    }
    return render(request, "lesson/lesson.html", context)


def edit_lessons(request, lesson_id, current_step):
    lesson = get_object_or_404(Lesson, pk=lesson_id)
    course = lesson.module.course

    modules = course.module_set.order_by("order")
    data_modules = []
    for module in modules:
        data_lessons = []
        for item_lesson in module.lesson_set.order_by("order"):
            data_lessons.append({
                "id": item_lesson.pk,
                "name": item_lesson.name
            })
        data_modules.append({
            "name": module.name,
            "lessons": data_lessons
        })

    steps = lesson.get_steps()
    if len(steps) >= current_step:
        step = steps[current_step - 1]
    else:
        step = steps[0]

    context = {
        "course_id": course.pk,
        "course_name": course.name,
        "modules": data_modules,
        "lesson": lesson,
        "steps": steps,
        "step": step
    }
    return render(request, "lesson/edit_lesson.html", context)
