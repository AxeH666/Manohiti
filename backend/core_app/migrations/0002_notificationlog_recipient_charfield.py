# Generated manually for NotificationLog.recipient CharField

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("core_app", "0001_initial"),
    ]

    operations = [
        migrations.AlterField(
            model_name="notificationlog",
            name="recipient",
            field=models.CharField(max_length=255),
        ),
    ]
