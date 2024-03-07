from django.db import models
from django.contrib.auth.models import User
from step.models import ChoiceMulti


class ProgressChoiceMulti(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(ChoiceMulti, on_delete=models.CASCADE)
    # points = models.PositiveSmallIntegerField()
    points = models.FloatField()
    solved = models.BooleanField(default=True)
    # select_answers = models.ManyToManyField(AnswerChoiceMulti)
    # order_answers = models.CharField(max_length=256)  # 0-1-2-3
    repeat_task = models.BooleanField(default=False)


class ProgressChoiceMultiItem(models.Model):
    progress_choice = models.ForeignKey(ProgressChoiceMulti, on_delete=models.CASCADE)
    # order_answers = models.CharField(max_length=256)  # [0-1-2-3] del
    points = models.FloatField()
    solved = models.BooleanField(default=False)  # del

    answers_json = models.JSONField()
