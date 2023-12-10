from django.contrib import admin
from .models import ProgressText, ProgressChoice


@admin.register(ProgressText)
class ProgressTextAdmin(admin.ModelAdmin):
    model = ProgressText
    list_display = ("user", "step", "checked")
    # list_filter = ("module",)


@admin.register(ProgressChoice)
class ProgressChoiceAdmin(admin.ModelAdmin):
    model = ProgressChoice
    list_display = ("user", "step", "points")
