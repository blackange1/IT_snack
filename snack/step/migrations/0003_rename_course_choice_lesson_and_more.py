# Generated by Django 4.2 on 2023-08-24 09:49

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('step', '0002_choice_course_code_course_text_course_video_course_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='choice',
            old_name='course',
            new_name='lesson',
        ),
        migrations.RenameField(
            model_name='code',
            old_name='course',
            new_name='lesson',
        ),
        migrations.RenameField(
            model_name='text',
            old_name='course',
            new_name='lesson',
        ),
        migrations.RenameField(
            model_name='video',
            old_name='course',
            new_name='lesson',
        ),
    ]
