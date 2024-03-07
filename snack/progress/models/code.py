from django.db import models
from django.contrib.auth.models import User
from step.models import Code


class ProgressCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Code, on_delete=models.CASCADE)
    points = models.FloatField()
    solved = models.BooleanField(default=True)
    repeat_task = models.BooleanField(default=False)


class ProgressCodeItem(models.Model):
    progress_code = models.ForeignKey(ProgressCode, on_delete=models.CASCADE)
    points = models.FloatField()
    solved = models.BooleanField(default=False)  # del
    user_code = models.TextField()
    # input = models.TextField()
    # output = models.TextField()
