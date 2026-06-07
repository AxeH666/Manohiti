from __future__ import annotations

from django.core.management.base import BaseCommand

from core_app.services.booking_dispatch import dispatch_booking_confirmation


class Command(BaseCommand):
    help = "Send booking confirmation notifications for a confirmed booking."

    def add_arguments(self, parser) -> None:
        parser.add_argument("booking_id", type=int)

    def handle(self, *args: object, **options: object) -> None:
        del args
        booking_id = int(options["booking_id"])
        dispatch_booking_confirmation(booking_id)
