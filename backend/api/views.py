from django.shortcuts import render, get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from .serializers import CourseSerializer, \
    CourseDetailSerializer, ModuleSerializer
from course.models import Course, Module
from lesson.models import Lesson
from step.models import LESSON_METHODS
from rest_framework.decorators import api_view

error = Response({
    'status': 'error'
})


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
        user = request.user
        for attribute in LESSON_METHODS:
            for item in lesson.__getattribute__(attribute).all():
                print('item', item.TYPE)
                data_item = {
                    'order': item.order,
                    'type': item.TYPE,
                    'id': item.id,
                }
                if item.TYPE == 'text':
                    data_item.update({'solved': item.get_solved(user=user)})
                elif item.TYPE == 'choice':
                    data_item.update({'solved': item.get_solved(user=user)})
                elif item.TYPE == 'choice_multi':
                    data_item.update({'solved': item.get_solved(user=user)})
                elif item.TYPE == 'code':
                    data_item.update({'solved': item.get_solved(user=user)})
                data.append(data_item)

        data.sort(key=lambda x: x.get('order'))
        return Response(data)


@api_view(['GET'])
def hello_world(request):
    return Response({'message': 'Hello, world!'})
