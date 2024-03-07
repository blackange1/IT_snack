from django.db import models
from .abstract import BaseStep, StepChoice, Order


class ChoiceMulti(BaseStep, StepChoice):
    TYPE = 'choice_multi'
    # множинний вибір
    # is_multiple_choice = models.BooleanField(default=False)

    points = models.FloatField(
        default=1, verbose_name="points | Бали")
    full_answer = models.BooleanField(default=True,
                                      verbose_name="full_answer | відповідь вірна за умови всіх відповідей")

    def get_solved(self, user):
        progress = self.progresschoicemulti_set.filter(user=user).first()
        if progress:
            return progress.solved
        return False

    def check_answer_multi(self, user, selected_indexes, answer_ids):
        # FIXED додаткова перевірка на кількість отриманих запитань
        # FIXED якщо хоч одна відповідь правильна
        if 0:
            not_correct, correct = 0, 0
            for index, pk in enumerate(answer_ids):
                answer = self.answerchoicemulti_set.filter(pk=pk).first()
                print('selected_indexes', selected_indexes)
                is_select = index in selected_indexes
                if not answer:
                    return ValueError('invalid select')
                if answer.is_correct:
                    if is_select:
                        correct += 1
                    else:
                        not_correct += 1
                elif is_select:
                    not_correct += 1

            points = self.points * round(correct / (correct + not_correct), 2)
            print('points', points)
            return 0, 0, 0, 0

        list_answers = []
        solved = True
        for index, pk in enumerate(answer_ids):
            answer = self.answerchoicemulti_set.filter(pk=pk).first()
            if not answer:
                return ValueError('invalid select')
            list_answers.append(answer.text)
            is_select = index in selected_indexes
            if is_select:
                if not answer.is_correct:
                    solved = False
            else:
                if answer.is_correct:
                    solved = False

        progress = self.progresschoicemulti_set.filter(user=user).first()
        points = self.points if solved else 0

        if progress:
            return progress, points, solved or self.is_always_correct, list_answers
        return None, points, solved or self.is_always_correct, list_answers

    class Meta:
        verbose_name_plural = "Тест Мульти  | ChoiceMulti"


class AnswerChoiceMulti(Order):
    class Meta:
        ordering = ['order']

    choice_multi = models.ForeignKey(ChoiceMulti, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)
