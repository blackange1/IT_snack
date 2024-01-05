from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice, ChoiceMulti, AnswerChoice, AnswerChoiceMulti


class ProgressText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Text, on_delete=models.CASCADE)
    checked = models.BooleanField(default=False)
    # solved


class ProgressChoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Choice, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)
    repeat_task = models.BooleanField(default=False)


class ProgressChoiceItem(models.Model):
    progress_choice = models.ForeignKey(ProgressChoice, on_delete=models.CASCADE)
    order_answers = models.CharField(max_length=256)  # [0-1-2-3]
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)
    select_answer = models.ForeignKey(AnswerChoice, on_delete=models.CASCADE)


class ProgressChoiceMulti(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(ChoiceMulti, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=True)
    # select_answers = models.ManyToManyField(ChoiceMulti)
    select_answers = models.ManyToManyField(AnswerChoiceMulti)
    order_answers = models.CharField(max_length=256)  # 0-1-2-3
    repeat_task = models.BooleanField(default=False)


PROGRESS_LIST = {
    'text': ProgressText,
    'choice': ProgressChoice,
    # 'code': Code,
    # 'video': Video,
}


def get_step_progress(typeof, step, user):
    if typeof in ['text']:
        progress = PROGRESS_LIST.get(typeof)
        item = 0
        # item = progress.objects.filter(step=step, user=user)
        return 1 if item else 0
    progress = PROGRESS_LIST.get(typeof)
    item = 0
    # item = progress.objects.filter(step=step, user=user)
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
