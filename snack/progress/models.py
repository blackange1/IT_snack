from django.db import models
from django.contrib.auth.models import User
from step.models import Text, Choice, ChoiceMulti


# ChoiceMulti, AnswerChoice, AnswerChoiceMulti


class ProgressText(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Text, on_delete=models.CASCADE)


class ProgressChoice(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    step = models.ForeignKey(Choice, on_delete=models.CASCADE)
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)
    repeat_task = models.BooleanField(default=False)
    is_multiple_choice = models.BooleanField(default=False)


class ProgressChoiceItem(models.Model):
    progress_choice = models.ForeignKey(ProgressChoice, on_delete=models.CASCADE)
    # order_answers = models.CharField(max_length=256)  # [0-1-2-3] del
    points = models.PositiveSmallIntegerField()
    solved = models.BooleanField(default=False)  # del
    # index = models.SmallIntegerField()  # del
    # selected_indexes = models.CharField(max_length=256)
    is_multiple_choice = models.BooleanField(default=False)
    # https: // docs.djangoproject.com / en / 5.0 / topics / db / queries /  # querying-jsonfield
    # answers_json = {
    #     0'answ-ers': ['apple', 'orange'],
    #     1'selected_-ind-exes': [1,2]
    # }
    answers_json = models.JSONField()


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
