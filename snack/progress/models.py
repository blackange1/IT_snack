from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice, Answer


class ProgressText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Text, on_delete=models.CASCADE)
    checked = models.BooleanField(default=False)
    # solved


class ProgressChoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Choice, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=True)
    answers = models.ManyToManyField(Answer, related_name="answers_set")
    answers_select = models.ManyToManyField(Answer, related_name="answers_select_set")


PROGRES_LIST = {
    'text': ProgressText,
    'choice': ProgressChoice,
    # 'code': Code,
    # 'video': Video,
}


def get_step_progres(typeof, step, user):
    if typeof in ['text']:
        progres = PROGRES_LIST.get(typeof)
        item = 0
        # item = progres.objects.filter(step=step, user=user)
        return 1 if item else 0
    progres = PROGRES_LIST.get(typeof)
    item = 0
    # item = progres.objects.filter(step=step, user=user)
    if item:
        print(item)
        return item[0].points
    return 0


# class StepText(Text):
#     class Meta:
#         proxy = True
#
#     def get_points(self):
#         print('self', self)
#         print('test')
#         return 2
