from rest_framework import serializers

from course.models import Course, Module
from lesson.models import Lesson


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ("id",
                  "name",
                  "order")


class ModuleSerializer(serializers.ModelSerializer):
    lesson_set = LessonSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Module
        fields = ("id",
                  "name",
                  "description",
                  "count_lessons",
                  "lesson_set",)


class CourseDetailSerializer(serializers.ModelSerializer):
    module_set = ModuleSerializer(many=True, read_only=True, required=False)

    class Meta:
        model = Course
        fields = ("id",
                  "name",
                  "description",
                  "module_set")


class CourseSerializer(serializers.ModelSerializer):

    class Meta:
        model = Course
        fields = '__all__'
