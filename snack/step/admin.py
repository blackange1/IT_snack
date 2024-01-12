from django.contrib import admin
from .models import Text, Video, Choice, Code, AnswerChoice, TestCase, ChoiceMulti, AnswerChoiceMulti

admin.site.register(Video)
admin.site.register(Text)


# Choice
class AnswerChoiceMultiInline(admin.StackedInline):
    model = AnswerChoice
    extra = 0


@admin.register(Choice)
class ChoiceAdmin(admin.ModelAdmin):
    model = Choice
    inlines = [AnswerChoiceMultiInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)


# ChoiceMulti
class AnswerChoiceInline(admin.StackedInline):
    model = AnswerChoiceMulti
    extra = 0


@admin.register(ChoiceMulti)
class ChoiceMultiAdmin(admin.ModelAdmin):
    model = ChoiceMulti
    inlines = [AnswerChoiceInline]
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
