from django.shortcuts import render
from course.models import Course


def index(request):
    courses = Course.objects.all()
    print('courses', courses)
    context = {
        'title': 'Головна сторінка',
        'courses': courses
    }
    return render(request, "core/index.html", context)


def urls(request):
    return render(request, "core/urls.html", {})


def teach_courses(request):
    # відфальтрувати по автору
    courses = Course.objects.all()
    print('courses', courses)
    context = {
        'title': 'Викладання',
        'courses': courses
    }
    return render(request, "core/teach_courses.html", context)


# teach/edit-course/<int:course_id>
# def edit_course(request, course_id):
#     print('course_id', course_id)
#     return render(request, "core/edit/course.html", {})
