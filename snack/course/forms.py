from django.forms import ModelForm, inlineformset_factory

from course.models import Course, Module


class ModuleForm(ModelForm):
    class Meta:
        model = Module
        exclude = ()


FamilyMemberFormSet = inlineformset_factory(Course, Module, form=ModuleForm, extra=1)
