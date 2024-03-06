from django.contrib import admin
from adminsortable2.admin import SortableStackedInline, SortableAdminBase
from .models import Text, Video, Choice, Code, AnswerChoice, TestCase, ChoiceMulti, AnswerChoiceMulti, Test

admin.site.register(Video)
admin.site.register(Text)
admin.site.register(Test)


# Choice
class AnswerChoiceInline(SortableStackedInline):
    model = AnswerChoice
    extra = 0


@admin.register(Choice)
class ChoiceAdmin(SortableAdminBase, admin.ModelAdmin):
    model = Choice
    inlines = [AnswerChoiceInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)


# ChoiceMulti
class AnswerChoiceMultiInline(SortableStackedInline):
    model = AnswerChoiceMulti
    extra = 0


@admin.register(ChoiceMulti)
class ChoiceMultiAdmin(SortableAdminBase, admin.ModelAdmin):
    model = ChoiceMulti
    inlines = [AnswerChoiceMultiInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)


# Code
class TestCaseInline(SortableStackedInline):
    model = TestCase
    extra = 0


@admin.register(Code)
class ChoiceAdmin(SortableAdminBase, admin.ModelAdmin):
    model = Code
    inlines = [TestCaseInline]
    # list_display = ("name", "description", "count_lessons")
    # list_filter = ("course",)
