from django.db import models
from course.models import EducationalMaterial, Module


class Lesson(EducationalMaterial):
    # name = models.CharField(max_length=64)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(default=0)

    def get_course(self):
        return self.module.course
