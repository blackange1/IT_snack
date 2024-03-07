from django.db import models
from django.contrib.auth.models import User
from step.models import Choice



class ProgressChoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Choice, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)
    repeat_task = models.BooleanField(default=False)
    # is_multiple_choice = models.BooleanField(default=False)


class ProgressChoiceItem(models.Model):
    progress_choice = models.ForeignKey(ProgressChoice, on_delete=models.CASCADE)
    # order_answers = models.CharField(max_length=256)  # [0-1-2-3] del
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)  # del
    # index = models.SmallIntegerField()  # del
    # selected_indexes = models.CharField(max_length=256)
    # is_multiple_choice = models.BooleanField(default=False)
    # https: // docs.djangoproject.com / en / 5.0 / topics / db / queries /  # querying-jsonfield
    # answers_json = {
    #     0'answ-ers': ['apple', 'orange'],
    #     1'selected_-ind-exes': [1,2]
    # }
    answers_json = models.JSONField()