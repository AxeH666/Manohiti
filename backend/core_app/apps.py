from django.apps import AppConfig
import os
import sys


class CoreConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "core_app"

    def ready(self) -> None:
        management_commands_to_skip = {
            "makemigrations",
            "migrate",
            "check",
            "collectstatic",
            "createsuperuser",
            "shell",
            "test",
        }
        if any(command in sys.argv for command in management_commands_to_skip):
            return

        # Django autoreloader spawns a parent process; run scheduler only in child.
        if os.getenv("RUN_MAIN") != "true" and "runserver" in sys.argv:
            return

        from .scheduler import start_scheduler

        start_scheduler()
