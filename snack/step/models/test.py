from django_quill.fields import QuillField

from django.db import models


class Test(models.Model):
    text_html_test = QuillField()
