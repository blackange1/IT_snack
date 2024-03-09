from django.db import models
from lesson.models import Lesson


class Order(models.Model):
    order = models.PositiveSmallIntegerField(default=0)

    class Meta:
        abstract = True
        ordering = ["order"]


class BaseStep(Order):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    text_html = models.TextField(verbose_name="HTML контент | text_html")

    # def __str__(self):
    #     return f'{self.lesson} - {self.order}'

    class Meta:
        abstract = True


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
