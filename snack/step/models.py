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
#         'Answer': 0,
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


## трикутник
class Video(Order):
    TYPE = 'video'
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)


## знак питання
class Choice(Step):
    TYPE = 'choice'

    # множинний вибір
    is_multiple_choice = models.BooleanField(default=False)

    # Будь-яка відповідь є правильною
    is_always_correct = models.BooleanField(default=False)

    # Не виводити відповіді випадково
    preserve_order = models.BooleanField(default=False)

    # увімкнено html
    is_html_enabled = models.BooleanField(default=False)

    # Пояснення поруч з відповідями
    is_options_feedback = models.BooleanField(default=False)

    # Розмір вибірки з варіантів відповіді
    sample_size = models.PositiveSmallIntegerField()


class Answer(Order):
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
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
