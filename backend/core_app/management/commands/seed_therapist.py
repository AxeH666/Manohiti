from __future__ import annotations

from django.core.management.base import BaseCommand

from core_app.seed_defaults import ensure_heti_therapist


class Command(BaseCommand):
    help = "Create the default Heti Mehra therapist profile if it does not exist."

    def handle(self, *args: object, **options: object) -> None:
        del args, options
        therapist, created = ensure_heti_therapist()
        if created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Created therapist profile: {therapist.display_name} ({therapist.email})"
                )
            )
        else:
            self.stdout.write(
                self.style.WARNING(
                    f"Therapist profile already exists: {therapist.display_name} ({therapist.email})"
                )
            )
