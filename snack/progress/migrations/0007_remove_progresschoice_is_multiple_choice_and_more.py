# Generated by Django 4.2 on 2024-01-14 14:44

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('progress', '0006_progresschoicemulti_progresschoicemultiitem'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='progresschoice',
            name='is_multiple_choice',
        ),
        migrations.RemoveField(
            model_name='progresschoiceitem',
            name='is_multiple_choice',
        ),
    ]
