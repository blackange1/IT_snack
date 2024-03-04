from django.contrib import admin

from .models import Course, Module
from lesson.models import Lesson


# Course
class ModuleInline(admin.StackedInline):
    model = Module
    extra = 0


@admin.register(Course)  # or admin.site.register(Course)
class CourseAdmin(admin.ModelAdmin):
    model = Course
    inlines = [ModuleInline]
    list_display = ("name", "description", "count_modules")


# Module
class LessonInline(admin.StackedInline):
    model = Lesson
    extra = 0


@admin.register(Module)
class ModuleAdmin(admin.ModelAdmin):
    model = Module
    inlines = [LessonInline]
    list_display = ("name", "description", "count_lessons")
    list_filter = ("course",)
