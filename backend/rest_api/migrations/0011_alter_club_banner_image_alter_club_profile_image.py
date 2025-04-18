# Generated by Django 5.1.7 on 2025-03-20 09:41

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('rest_api', '0010_remove_club_is_public'),
    ]

    operations = [
        migrations.AlterField(
            model_name='club',
            name='banner_image',
            field=models.ImageField(blank=True, null=True, upload_to='club_banner_images/'),
        ),
        migrations.AlterField(
            model_name='club',
            name='profile_image',
            field=models.ImageField(blank=True, null=True, upload_to='club_profile_image/'),
        ),
    ]
