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
from step.models import STEP_LIST, LESSON_METHODS, Text, Choice


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


# class StepItem(APIView):
#     def get(self, request, step_type, step_id):
#         # print(step_type, step_id)
#         class_step = STEP_LIST.get(step_type, None)
#         data = {}
#         if not class_step:
#             print(class_step)
#             return Response({
#                 'status': 'error',
#             })
#         if class_step.TYPE == 'text':
#             ret
#         print(class_step.TYPE)
#         return Response({
#             'data': 'data',
#         })

class StepText(APIView):
    def get(self, request, step_id):
        text = get_object_or_404(Text, pk=step_id)
        return Response({
            'text_html': text.text_html
        })

    def post(self, request, step_id):
        print(dir(request))
        print(request.user)
        print(request.data)
        print(step_id)
        return Response({
            'status': 'ok'
        })


class StepChoice(APIView):
    def get(self, request, step_id):
        choice = get_object_or_404(Choice, pk=step_id)
        if choice.preserve_order:
            answer_set = choice.answer_set.all()
        else:
            answer_set = choice.answer_set.order_by("?")

        answers = []
        for answer in answer_set[:choice.sample_size]:
            answers.append({
                'id': answer.id,
                'text': answer.text
            })

        return Response({
            'id': choice.id,
            'text_html': choice.text_html,
            'is_multiple_choice': choice.is_multiple_choice,
            'is_always_correct': choice.is_always_correct,
            'preserve_order': choice.preserve_order,
            'is_html_enabled': choice.is_html_enabled,
            'is_options_feedback': choice.is_options_feedback,
            'sample_size': choice.sample_size,
            'points': choice.points,
            'answers': answers,
        })

    def post(self, request, step_id):
        print(dir(request))
        print(request.user)
        print(request.data)
        print(step_id)
        return Response({
            'status': 'ok'
        })
