from django.db import models
from course.models import Module, EducationalMaterial


class Lesson(EducationalMaterial):
    # name = models.CharField(max_length=64)
    module = models.ForeignKey(Module, on_delete=models.CASCADE)
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        ordering = ['order']

    def get_course(self):
        return self.module.course

    def get_steps(self) -> list:
        step_query_set = [
            self.text_set.all(),
            self.choice_set.all(),
            self.choicemulti_set.all(),
            self.code_set.all()
        ]
        steps = []
        for query_set in step_query_set:
            for item in query_set:
                steps.append(item)

        steps.sort(key=lambda obj: obj.order)

        return steps
