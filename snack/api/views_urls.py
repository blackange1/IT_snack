from django.shortcuts import render

from course.models import Course, Module
from lesson.models import Lesson
from step.models import Text, Choice, ChoiceMulti, Code


def api_url(request):
    course = Course.objects.first()
    module = Module.objects.first()
    lesson = Lesson.objects.first()

    text = Text.objects.first()
    choice = Choice.objects.first()
    choice_multi = ChoiceMulti.objects.first()
    code = Code.objects.first()

    print('course', course.pk)
    context = {
        "links": [
            {
                "url": f"step-menu/{course.pk}",
                "desc": "Отримати меню"
            },
            {
                "url": "courses",
                "desc": "Всі курси"
            },
            {
                "url": f"courses/{course.pk}",
                "desc": "Один курс"
            },
            {
                "url": f"modules/{module.pk}",
                "desc": "Один модуль"
            },
            {
                "url": f"step-item/text/{lesson.pk}",
                "desc": "Один урок"
            },
            # steps
            {
                "url": f"step-item/text/{text.pk}",
                "desc": "Текст"
            },
            {
                "url": f"step-item/choice/{choice.pk}",
                "desc": "Тест родіо"
            },
            {
                "url": f"step-item/choice_multi/{choice_multi.pk}",
                "desc": "Тест чекбокс"
            },
            {
                "url": f"step-item/code/{code.pk}",
                "desc": "Код"
            },

        ]
    }

    return render(request, "api/api_urls.html", context)
