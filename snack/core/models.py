import json

from django.db import models

# add course | test data
from course.models import Course, Module
from lesson.models import Lesson
from step.models import Text, Choice, Answer
from pathlib import Path
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

CURRENT_FILE_PATH = Path.cwd().joinpath('core').joinpath('models_TEST_DATA.json')

TYPE_STEP = [
    'Text',
    'Video',
    'Choice',
    'Code',
]

if False:
    with open(CURRENT_FILE_PATH, 'r', encoding='utf-8') as file:
        print('file', file)
        json_content = file.read()
        data_dict = json.loads(json_content)
    print(data_dict)

    for course in [data_dict]:
        if course.get('can_save') is False:
            continue
        course_name = course.get('name')
        if not Course.objects.filter(name=course_name):
            obj_course = Course(
                name=course_name,
                description=course.get('description', ''),
            )
            obj_course.save()
            for module in course.get('modules', []):
                print(module)
                obj_module = Module(
                    name=module['name'],
                    order=module['order'],
                    description=module.get('description'),
                    course=obj_course,
                )
                obj_module.save()
                for lesson in module.get('lessons', []):
                    print(lesson)
                    obj_lesson = Lesson(
                        name=lesson['name'],
                        order=lesson['order'],
                        module=obj_module,
                    )
                    obj_lesson.save()
                    for step in lesson.get('steps', []):
                        type_step = step['CLASS_NAME']
                        if type_step == 'Text':
                            print(step)
                            print('type_step', type_step)
                            obj_text = Text(
                                order=step['order'],
                                text_html=step['text_html'],
                                lesson=obj_lesson,
                            )
                            print('obj_text', obj_text)
                            obj_text.save()
                        elif type_step == 'Video':
                            pass
                        elif type_step == 'Choice':
                            obj_choice = Choice(
                                order=step.get('order', 0),
                                text_html=step.get('text_html', 'text_html'),
                                lesson=obj_lesson,

                                is_multiple_choice=step.get('is_multiple_choice', False),
                                is_always_correct=step.get('is_always_correct', False),
                                preserve_order=step.get('preserve_order', False),
                                is_html_enabled=step.get('is_html_enabled', False),
                                is_options_feedback=step.get('is_options_feedback', False),
                                sample_size=step.get('sample_size', 0),
                            )
                            obj_choice.save()
                            for answer in step.get('answers', []):
                                obj_answer = Answer(
                                    choice=obj_choice,
                                    is_correct=answer.get('is_correct', False),
                                    text=answer.get('text', 'text'),
                                    feedback=answer.get('feedback', ''),
                                )
                                obj_answer.save()
                        elif type_step == 'Code':
                            pass
    # m = Module.objects.get(name='test Module')


# https://vegibit.com/how-to-extend-django-user-model/

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    study_courses = models.ManyToManyField(Course)


@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)


@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()
