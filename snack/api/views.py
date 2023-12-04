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
        attributes = [
            'text_set',
            'video_set',
            'choice_set',
            'code_set',
        ]

        for attribute in attributes:
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
