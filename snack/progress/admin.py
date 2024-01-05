from django.contrib import admin
from .models import ProgressText, ProgressChoice, ProgressChoiceItem


@admin.register(ProgressText)
class ProgressTextAdmin(admin.ModelAdmin):
    model = ProgressText
    list_display = ("user", "step", "checked")
    # list_filter = ("module",)


@admin.register(ProgressChoice)
class ProgressChoiceAdmin(admin.ModelAdmin):
    model = ProgressChoice
    list_display = ("user", "step", "points", "solved")


@admin.register(ProgressChoiceItem)
class ProgressChoiceItemAdmin(admin.ModelAdmin):
    model = ProgressChoiceItem
    list_display = ("progress_choice", "points", "solved")
