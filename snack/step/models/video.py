from .abstract import Order
from django.db import models
from lesson.models import Lesson


class Video(Order):
    TYPE = 'video'
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = "Відео ______ | Video"
