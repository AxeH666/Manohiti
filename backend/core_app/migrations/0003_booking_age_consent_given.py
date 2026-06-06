from __future__ import annotations

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("core_app", "0002_notificationlog_recipient_charfield"),
    ]

    operations = [
        migrations.AddField(
            model_name="booking",
            name="consent_given",
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name="booking",
            name="age",
            field=models.IntegerField(default=18),
            preserve_default=False,
        ),
    ]
