# Generated by Django 5.1.7 on 2025-03-20 12:03

import django.db.models.deletion
import uuid
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0011_alter_club_banner_image_alter_club_profile_image'),
    ]

    operations = [
        migrations.CreateModel(
            name='ClubMember',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('club', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='Clubs', to='rest_api.club')),
                ('follower', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='member', to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'ordering': ['-created_at'],
                'constraints': [models.UniqueConstraint(fields=('follower', 'club'), name='unique_membership')],
            },
        ),
    ]
