# Generated by Django 4.2 on 2023-12-10 14:45

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('step', '0011_choice_points_alter_choice_preserve_order'),
    ]

    operations = [
        migrations.CreateModel(
            name='ProgressText',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('points', models.PositiveSmallIntegerField()),
                ('step', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='step.text')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
