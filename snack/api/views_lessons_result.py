from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.views import APIView

from lesson.models import Lesson


class ResultCourse(APIView):
    pass


class ResultLesson(APIView):
    def get(self, request, lesson_id):
        lesson = get_object_or_404(Lesson, pk=lesson_id)

        return Response({
            'status': 'ok',
        })
