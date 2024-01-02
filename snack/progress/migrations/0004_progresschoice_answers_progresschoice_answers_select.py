# Generated by Django 4.2 on 2024-01-01 21:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('step', '0011_choice_points_alter_choice_preserve_order'),
        ('progress', '0003_progresschoice_solved'),
    ]

    operations = [
        migrations.AddField(
            model_name='progresschoice',
            name='answers',
            field=models.ManyToManyField(related_name='answers_set', to='step.answer'),
        ),
        migrations.AddField(
            model_name='progresschoice',
            name='answers_select',
            field=models.ManyToManyField(related_name='answers_select_set', to='step.answer'),
        ),
    ]
