from __future__ import annotations

from django.core.management.base import BaseCommand

from core_app.seed_defaults import ensure_default_weekly_slots, ensure_heti_therapist


class Command(BaseCommand):
    help = (
        "Ensure Heti Mehra's therapist profile exists and seed default weekly "
        "availability slots (Mon–Fri 10:00 and 15:00 IST)."
    )

    def handle(self, *args: object, **options: object) -> None:
        del args, options
        therapist, therapist_created = ensure_heti_therapist()
        if therapist_created:
            self.stdout.write(
                self.style.SUCCESS(
                    f"Created therapist profile: {therapist.display_name}"
                )
            )
        else:
            self.stdout.write(f"Using therapist profile: {therapist.display_name}")

        created, existing = ensure_default_weekly_slots(therapist)
        self.stdout.write(
            self.style.SUCCESS(
                f"Slots seeded: {created} created, {existing} already existed."
            )
        )
