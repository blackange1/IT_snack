from django.shortcuts import render
from .models import Course
from django.http import HttpResponse, Http404, HttpResponseRedirect
from django.shortcuts import get_object_or_404


# /course/<int:course_id>/syllabus/
def syllabus(request, course_id):
    # print(request.user)
    course = get_object_or_404(Course, pk=course_id)
    module = course.module_set.all().order_by('order')
    print(dir(course))
    print(module)
    return render(request, "course/syllabus.html", {
        'title': 'Програма курсу - ' + course.name,
        'course': course,
        'modules': 5
    })


# /course/<int:course_id>/edit/
def syllabus_edit(request, course_id):
    # print(syllabus_edit)
    course = get_object_or_404(Course, pk=course_id)
    return render(request, "course/syllabus-edit.html", {
        'title': course.name + ' - IT snack',
        'course': course
    })
