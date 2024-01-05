from django.db import models
from lesson.models import Lesson


# parents = {
#     'Order': {
#         'Step': {
#             'Text': 0,
#             'Choice': 0,
#             'Code': 0,
#         },
#         'Video': 0,
#         'AnswerChoice': 0,
#         'TestCase': 0,
#     }
# }


class Order(models.Model):
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        abstract = True


class Step(Order):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    text_html = models.TextField()

    # def __str__(self):
    #     return f'{self.lesson} - {self.order}'

    class Meta:
        abstract = True


# Standart
## пусто
class Text(Step):
    TYPE = 'text'

    def get_solved(self, user):
        return bool(self.progresstext_set.filter(user=user).first())

    def get_points(self, user):
        progress = self.progresstext_set.filter(user=user).first()
        if progress:
            return 1
        return 0


## трикутник
class Video(Order):
    TYPE = 'video'
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)


class StepChoice(models.Model):
    is_always_correct = models.BooleanField(default=False)

    # Не виводити відповіді випадково | зберігати порядок
    preserve_order = models.BooleanField(default=True)

    # увімкнено html
    is_html_enabled = models.BooleanField(default=False)

    # Пояснення поруч з відповідями
    is_options_feedback = models.BooleanField(default=False)

    points = models.PositiveSmallIntegerField(default=1)

    class Meta:
        abstract = True


## знак питання
class Choice(Step, StepChoice):
    TYPE = 'choice'

    def get_points(self, user):
        progress = self.progresschoice_set.filter(user=user).first()
        if progress:
            return progress.points
        return 0

    def get_solved(self, user):
        progress = self.progresschoice_set.filter(user=user).first()
        if progress:
            return progress.solved
        return False

    def check_answer(self, user, select):
        # FIXED додати ліміт на спроби
        answer = self.answerchoice_set.filter(pk=select).first()
        if not answer:
            return ValueError('invalid select')
        progress = self.progresschoice_set.filter(user=user).first()
        max_points = self.points
        points = self.points if answer.is_correct else 0
        if progress:
            # progress.points = max_points
            # progress.save()
            return progress, points, answer.is_correct
        return None, points, answer.is_correct


class ChoiceMulti(Step, StepChoice):
    TYPE = 'choice_multi'
    # множинний вибір
    # is_multiple_choice = models.BooleanField(default=False)

    sample_size = models.PositiveSmallIntegerField()

    def check_answer_multi(self, user, selected, answers):
        # FIXED додаткова перевірка на кількість отриманих запитань
        not_correct, correct = 0, 0
        for index, pk in enumerate(answers):
            answer = self.answerchoice_set.filter(pk=pk).first()
            select = selected[index]
            if answer:
                if answer.is_correct:
                    if select:
                        correct += 1
                    else:
                        not_correct += 1
                elif select:
                    not_correct += 1
            else:
                pass  # errot

        points = self.points * round(correct / (correct + not_correct), 2)
        print('points', points)
        progress = self.progresschoice_set.filter(user=user).first()
        if progress:
            if points >= progress.points:
                progress.points = points
                # progress.save()
            return progress, points, points > 0
        return None, points, points > 0


class AnswerChoice(Order):
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)


class AnswerChoiceMulti(Order):
    choice_multi = models.ForeignKey(ChoiceMulti, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)


## знак консолі
class Code(Step):
    TYPE = 'code'


class TestCase(Order):
    choice = models.ForeignKey(Code, on_delete=models.CASCADE)
    input = models.TextField(blank=True, null=True)
    output = models.TextField(blank=True, null=True)


STEP_LIST = {
    'text': Text,
    'choice': Choice,
    'code': Code,
    'video': Video,
}

TYPE_STEPS = list(STEP_LIST.keys())

LESSON_METHODS = [f'{item}_set' for item in TYPE_STEPS]
