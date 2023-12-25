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

    # def get_points(self, user):
    #     print(dir(self))
    #     print(self.progresstext_set)
    #     print(self.progresstext_set.fi)
    #     print(self, user)
    #     return 4
    # progress_text = ProgressText.objects.filter(step=self, user=user)
    # print('progress_text', progress_text)
    # return bool(progress_text)

    def get_points(self, user):
        # print(dir(self))
        progress = self.progresstext_set.filter(user=user).first()
        if progress:
            return 1
        return 0


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

    # Не виводити відповіді випадково | зберігати порядок
    preserve_order = models.BooleanField(default=True)

    # увімкнено html
    is_html_enabled = models.BooleanField(default=False)

    # Пояснення поруч з відповідями
    is_options_feedback = models.BooleanField(default=False)

    # Розмір вибірки з варіантів відповіді
    sample_size = models.PositiveSmallIntegerField()

    points = models.PositiveSmallIntegerField(default=1)

    # def check(self):
    #     pass

    def get_points(self, user):
        progress = self.progresschoice_set.filter(user=user).first()
        if progress:
            return progress.points
        return 0


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
