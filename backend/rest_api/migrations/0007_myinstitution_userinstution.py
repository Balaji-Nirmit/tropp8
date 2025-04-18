# Generated by Django 5.1.7 on 2025-03-19 12:55

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0006_myuser_created_at'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyInstitution',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('name', models.CharField(db_index=True, max_length=255, unique=True)),
                ('city', models.CharField(blank=True, db_index=True, max_length=100, null=True)),
                ('country', models.CharField(blank=True, db_index=True, max_length=100, null=True)),
                ('website', models.URLField(blank=True, null=True)),
            ],
            options={
                'ordering': ['name'],
            },
        ),
        migrations.CreateModel(
            name='UserInstution',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('degree', models.CharField(blank=True, max_length=255, null=True)),
                ('start_date', models.DateTimeField(blank=True, help_text='Stored as YYYY-MM-01', null=True)),
                ('end_date', models.DateTimeField(blank=True, help_text='Stored as YYYY-MM-01', null=True)),
                ('is_current', models.BooleanField(default=False)),
                ('institution', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='student_instution', to='rest_api.myinstitution')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='user_education', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'constraints': [models.UniqueConstraint(fields=('user', 'institution', 'degree'), name='unique_educational_background')],
            },
        ),
    ]
