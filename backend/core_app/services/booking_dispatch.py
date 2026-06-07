from __future__ import annotations

from core_app.models import Booking
from core_app.notifications import send_booking_confirmation


def dispatch_booking_confirmation(booking_id: int) -> None:
    try:
        booking = Booking.objects.get(id=booking_id)
    except Booking.DoesNotExist:
        return
    send_booking_confirmation(booking)
