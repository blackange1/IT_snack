from django.contrib import admin
from .models import Text, Video, Choice, Code, AnswerChoice, TestCase

admin.site.register(Text)


# Choice
class AnswerInline(admin.StackedInline):
    model = AnswerChoice
    extra = 0


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    model = Choice
    inlines = [AnswerInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)


# Code
class TestCaseInline(admin.StackedInline):
    model = TestCase
    extra = 0


@admin.register(Code)
class ChoiceAdmin(admin.ModelAdmin):
    model = Code
    inlines = [TestCaseInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)


admin.site.register(Video)
