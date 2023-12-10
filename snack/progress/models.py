from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice


class ProgressText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Text, on_delete=models.CASCADE)
    checked = models.BooleanField(default=False)


class ProgressChoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Choice, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
