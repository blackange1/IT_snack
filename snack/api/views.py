from django.shortcuts import render, get_object_or_404

# Create your views here.

from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import generics
from .serializers import CourseSerializer, CourseDetailSerializer, ModuleSerializer
from course.models import Course, Module


# class CourseList(generics.ListCreateAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer
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
