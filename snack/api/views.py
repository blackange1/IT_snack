from django.shortcuts import render, get_object_or_404

# Create your views here.

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .serializers import CourseSerializer, \
    CourseDetailSerializer, ModuleSerializer, LessonSerializer
from course.models import Course, Module
from lesson.models import Lesson
from django.conf import settings

LESSON_METHODS = settings.LESSON_METHODS
TYPE_STEPS = settings.TYPE_STEPS


class CourseList(APIView):
    def get(self, request):
        courses = Course.objects.all()[:20]
        data = CourseSerializer(courses, many=True).data
        return Response(data)


class CourseDetail(APIView):
    # serializer_class = CourseSerializer
    def get(self, request, course_id):
        course = get_object_or_404(Course, pk=course_id)
        data = CourseDetailSerializer(course).data
        return Response(data)


class ModuleDetail(APIView):
    def get(self, request, module_id):
        course = get_object_or_404(Module, pk=module_id)
        data = ModuleSerializer(course).data
        print(data)
        return Response(data)


class StepMenu(APIView):
    def get(self, request, lesson_id):
        data = []
        lesson = get_object_or_404(Lesson, pk=lesson_id)
        print(dir(lesson))

        for attribute in LESSON_METHODS:
            for item in lesson.__getattribute__(attribute).all():
                data.append({
                    'order': item.order,
                    'type': item.TYPE,
                    'id': item.id,
                    'solved': False,
                })
                # print(item.TYPE, item.order, item.id)

        data.sort(key=lambda x: x.get('order'))
        return Response(data)


class StepItem(APIView):
    def get(self, request, step_type, step_id):
        print(step_type, step_id)
        print(TYPE_STEPS)
        if step_type not in TYPE_STEPS:
            print(step_type)
            return Response({
                'status': 'error',
            })

        return Response({
            'data': 'data',
        })
