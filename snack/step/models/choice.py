from django.db import models
from .abstract import BaseStep, StepChoice, Order


## знак питання
class Choice(BaseStep, StepChoice):
    TYPE = 'choice'

    points = models.PositiveSmallIntegerField(
        default=1, verbose_name="points | Бали")

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

    def check_answer(self, user, select: int, answer_ids: list):
        # FIXED додати ліміт на спроби
        answer = self.answerchoice_set.filter(pk=select).first()
        if not answer:
            return ValueError('invalid select')
        progress = self.progresschoice_set.filter(user=user).first()
        points = self.points if answer.is_correct else 0

        list_answers = []
        if self.preserve_order:
            list_answers = [answer_choice.text for answer_choice in self.answerchoice_set.order_by("order")]
        else:
            for answer_id in answer_ids:
                list_answers.append(self.answerchoice_set.filter(pk=answer_id).first().text)
        if progress:
            return progress, points, answer.is_correct or self.is_always_correct, list_answers
        return None, points, answer.is_correct or self.is_always_correct, list_answers

    class Meta:
        verbose_name_plural = "Тест _______ | Choice"


class AnswerChoice(Order):
    class Meta:
        ordering = ['order']

    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)
