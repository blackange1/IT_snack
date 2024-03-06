from django.db import models
from lesson.models import Lesson
from step.check_code.py_compile import ValidateCodePython
from django_quill.fields import QuillField


# TODO:
# https://pypi.org/project/django-quill-editor/
# https://django-quill-editor.readthedocs.io/en/latest/pages/migrating-to-quillfield.html

class VerboseName(object):
    def __init__(self, verbose_name_plural):
        self.verbose_name_plural = verbose_name_plural
        self.MAX_LEN_KEY = max(*[len(key) for key in verbose_name_plural.keys()])

    def get_verbose_name(self, key):
        value = self.verbose_name_plural.get(key, None)
        if value:
            return f'{value + " " + ("_" * (self.MAX_LEN_KEY - len(value)))} | {key}'
        return f"Not key {key}"


step_verbose_name = VerboseName({
    "Text": "Текст",
    "Video": "Відео",
    "Choice": "Тест",
    "ChoiceMulti": "Тест Мульти",
    "Code": "Код",
})


class Test(models.Model):
    text_html_test = QuillField()


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
    text_html = models.TextField(verbose_name="HTML контент | text_html")

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

    class Meta:
        verbose_name_plural = step_verbose_name.get_verbose_name("Text")


## трикутник
class Video(Order):
    TYPE = 'video'
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)

    class Meta:
        verbose_name_plural = step_verbose_name.get_verbose_name("Video")


class StepChoice(models.Model):
    is_always_correct = models.BooleanField(
        default=False, verbose_name="is_always_correct | Всі відповіді правильні")

    # Не виводити відповіді випадково | зберігати порядок
    preserve_order = models.BooleanField(
        default=True, verbose_name="preserve_order | Не виводити відповіді випадково")

    # увімкнено html
    is_html_enabled = models.BooleanField(
        default=False, verbose_name="is_html_enabled | Рендерити як HTML")

    # Пояснення поруч з відповідями
    is_options_feedback = models.BooleanField(
        default=False, verbose_name="is_options_feedback | Пояснення поруч з відповідями")

    # is_multiple_choice = models.BooleanField(default=False)

    sample_size = models.PositiveSmallIntegerField(
        default=4, verbose_name="sample_size | Розмір відповідей")

    class Meta:
        abstract = True


## знак питання
class Choice(Step, StepChoice):
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
        verbose_name_plural = step_verbose_name.get_verbose_name("Choice")


class ChoiceMulti(Step, StepChoice):
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
        verbose_name_plural = step_verbose_name.get_verbose_name("ChoiceMulti")


class AnswerChoice(Order):
    class Meta:
        ordering = ['order']

    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)


class AnswerChoiceMulti(Order):
    class Meta:
        ordering = ['order']

    choice_multi = models.ForeignKey(ChoiceMulti, on_delete=models.CASCADE)
    is_correct = models.BooleanField(default=False)
    text = models.CharField(max_length=512)
    feedback = models.CharField(max_length=512, blank=True, null=True)


## знак консолі
class Code(Step):
    class Meta:
        verbose_name_plural = step_verbose_name.get_verbose_name("Code")

    count_show_test = models.SmallIntegerField(default=1)
    points = models.SmallIntegerField(default=1)

    def get_solved(self, user):
        progress = self.progresscode_set.filter(user=user).first()
        if progress:
            return progress.solved
        return False

    @staticmethod
    def run_code(user_code, data_input):
        test = ValidateCodePython(user_code, data_input)
        res, error = test.run_code()
        print('res, error', (res, error))
        if not error:
            return res
        return 'error'

    def check_code(self, user_code, user):
        print('ValidateCodePython', ValidateCodePython)

        tests = []
        for testcase in self.testcase_set.all():
            # print(testcase)
            test = ValidateCodePython(user_code, testcase.input, testcase.output)
            res, error = test.check_code()
            # print('res, error', res, error)
            tests.append(res)

        progress = self.progresscode_set.filter(user=user).first()
        print(' - progress', progress)
        solved = all(tests)
        points = self.points if solved else 0
        if progress:
            return progress, points, solved, tests
        return None, points, solved, tests


class TestCase(Order):
    class Meta:
        ordering = ['order']

    code = models.ForeignKey(Code, on_delete=models.CASCADE)
    input = models.TextField(blank=True, null=True)
    output = models.TextField(blank=True, null=True)


STEP_LIST = {
    'text': Text,
    'choice': Choice,
    'choicemulti': ChoiceMulti,
    'code': Code,
    'video': Video,
}

TYPE_STEPS = list(STEP_LIST.keys())

LESSON_METHODS = [f'{item}_set' for item in TYPE_STEPS]
