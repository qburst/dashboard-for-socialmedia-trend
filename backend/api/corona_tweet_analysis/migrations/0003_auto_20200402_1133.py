# Generated by Django 2.2.11 on 2020-04-02 11:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('corona_tweet_analysis', '0002_auto_20200402_1107'),
    ]

    operations = [
        migrations.RenameField(
            model_name='category',
            old_name='created_or_modified_by',
            new_name='created_by',
        ),
    ]
