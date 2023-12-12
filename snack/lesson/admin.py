from django.contrib import admin
from .models import Lesson


# Register your models here.
# Lesson
@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    model = Lesson
    list_display = ("name", "order")
    list_filter = ("module",)
