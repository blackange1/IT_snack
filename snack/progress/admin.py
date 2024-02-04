from django.contrib import admin
from .models import ProgressText, ProgressChoice, ProgressChoiceItem, ProgressChoiceMulti, ProgressChoiceMultiItem, \
    ProgressCode, ProgressCodeItem


@admin.register(ProgressText)
class ProgressTextAdmin(admin.ModelAdmin):
    model = ProgressText
    list_display = ("user", "step")
    # list_filter = ("module",)


@admin.register(ProgressChoice)
class ProgressChoiceAdmin(admin.ModelAdmin):
    model = ProgressChoice
    list_display = ("user", "step", "points", "solved")


@admin.register(ProgressChoiceItem)
class ProgressChoiceItemAdmin(admin.ModelAdmin):
    model = ProgressChoiceItem
    list_display = ("progress_choice", "points", "solved")


@admin.register(ProgressChoiceMulti)
class ProgressChoiceMultiAdmin(admin.ModelAdmin):
    model = ProgressChoiceMulti
    list_display = ("user", "step", "points", "solved")


@admin.register(ProgressChoiceMultiItem)
class ProgressChoiceMultiItemAdmin(admin.ModelAdmin):
    model = ProgressChoiceMultiItem
    list_display = ("progress_choice", "points", "solved")


@admin.register(ProgressCode)
class ProgressCodeAdmin(admin.ModelAdmin):
    model = ProgressCode
    list_display = ("user", "step", "points", "solved")


@admin.register(ProgressCodeItem)
class ProgressCodeItemAdmin(admin.ModelAdmin):
    model = ProgressCodeItem
    list_display = ("progress_code", "points", "solved")
