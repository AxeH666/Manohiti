from __future__ import annotations

import os
from datetime import time

from django.contrib.auth import get_user_model

from core_app.models import AvailabilitySlot, TherapistProfile

DEFAULT_THERAPIST_DISPLAY_NAME = "Heti Mehra"
DEFAULT_THERAPIST_EMAIL = os.getenv("THERAPIST_EMAIL", "heti3215@gmail.com")
DEFAULT_THERAPIST_USERNAME = "heti"

# day_of_week: 0=Monday … 6=Sunday
DEFAULT_WEEKLY_SLOTS: list[tuple[int, time]] = [
    (0, time(10, 0)),
    (0, time(15, 0)),
    (1, time(10, 0)),
    (1, time(15, 0)),
    (2, time(10, 0)),
    (2, time(15, 0)),
    (3, time(10, 0)),
    (3, time(15, 0)),
    (4, time(10, 0)),
    (4, time(15, 0)),
]


def ensure_heti_therapist() -> tuple[TherapistProfile, bool]:
    """Create or return Heti Mehra's active therapist profile."""
    user_model = get_user_model()
    user, user_created = user_model.objects.get_or_create(
        username=DEFAULT_THERAPIST_USERNAME,
        defaults={
            "email": DEFAULT_THERAPIST_EMAIL,
            "first_name": "Heti",
            "last_name": "Mehra",
        },
    )
    if user.email != DEFAULT_THERAPIST_EMAIL:
        user.email = DEFAULT_THERAPIST_EMAIL
        user.save(update_fields=["email"])

    therapist, therapist_created = TherapistProfile.objects.get_or_create(
        user=user,
        defaults={
            "display_name": DEFAULT_THERAPIST_DISPLAY_NAME,
            "email": DEFAULT_THERAPIST_EMAIL,
            "bio": "Clinical psychologist offering individual therapy sessions.",
            "is_active": True,
        },
    )

    updated = False
    if not therapist.is_active:
        therapist.is_active = True
        updated = True
    if therapist.display_name != DEFAULT_THERAPIST_DISPLAY_NAME:
        therapist.display_name = DEFAULT_THERAPIST_DISPLAY_NAME
        updated = True
    if therapist.email != DEFAULT_THERAPIST_EMAIL:
        therapist.email = DEFAULT_THERAPIST_EMAIL
        updated = True
    if updated:
        therapist.save()

    return therapist, user_created or therapist_created


def ensure_default_weekly_slots(therapist: TherapistProfile) -> tuple[int, int]:
    """Create default weekly availability slots. Returns (created, existing)."""
    created_count = 0
    existing_count = 0

    for day_of_week, start_time in DEFAULT_WEEKLY_SLOTS:
        _slot, created = AvailabilitySlot.objects.get_or_create(
            therapist=therapist,
            day_of_week=day_of_week,
            start_time=start_time,
            defaults={
                "duration_minutes": 60,
                "is_booked": False,
            },
        )
        if created:
            created_count += 1
        else:
            existing_count += 1

    return created_count, existing_count
