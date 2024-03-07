from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice, ChoiceMulti, Code


# ChoiceMulti, AnswerChoice, AnswerChoiceMulti

# PROGRESS_LIST = {
#     'text': ProgressText,
#     'choice': ProgressChoice,
#     # 'code': Code,
#     # 'video': Video,
# }


# def get_step_progress(typeof, step, user):
#     if typeof in ['text']:
#         progress = PROGRESS_LIST.get(typeof)
#         item = 0
#         # item = progress.objects.filter(step=step, user=user)
#         return 1 if item else 0
#     progress = PROGRESS_LIST.get(typeof)
#     item = 0
#     # item = progress.objects.filter(step=step, user=user)
#     if item:
#         print(item)
#         return item[0].points
#     return 0

# class StepText(Text):
#     class Meta:
#         proxy = True
#
#     def get_points(self):
#         print('self', self)
#         print('test')
#         return 2
