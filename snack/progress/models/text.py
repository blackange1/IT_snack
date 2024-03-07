from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice, ChoiceMulti, Code


class ProgressText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Text, on_delete=models.CASCADE)