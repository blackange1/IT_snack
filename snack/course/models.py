from django.db import models


class EducationalMaterial(models.Model):
    name = models.CharField(max_length=64)

    def __str__(self):
        return self.name

    class Meta:
        abstract = True


class Course(EducationalMaterial):
    # name = models.CharField(max_length=64)
    description = models.TextField(max_length=512)

    def count_modules(self):
        return self.module_set.all().count()


class Module(EducationalMaterial):
    # name = models.CharField(max_length=64)
    description = models.TextField(max_length=256, blank=True, null=True)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(default=0, blank=False, null=False)

    class Meta:
        ordering = ['order']

    def count_lessons(self):
        return self.lesson_set.all().count()
