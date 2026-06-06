from __future__ import annotations

from datetime import timedelta
from zoneinfo import ZoneInfo

from apscheduler.schedulers.background import BackgroundScheduler
from django.utils import timezone

from core_app.models import Booking, BookingStatus
from core_app.notifications import send_session_reminder
from core_app.services.calendar import SESSION_TIMEZONE, booking_starts_at

_scheduler: BackgroundScheduler | None = None
_started: bool = False

REMINDER_WINDOWS = {
    "24h": (timedelta(hours=23, minutes=45), timedelta(hours=24, minutes=15)),
    "1h": (timedelta(minutes=45), timedelta(hours=1, minutes=15)),
}


def process_session_reminders() -> None:
    now = timezone.now()
    if now.tzinfo is None:
        now = now.replace(tzinfo=SESSION_TIMEZONE)
    else:
        now = now.astimezone(SESSION_TIMEZONE)

    bookings = Booking.objects.filter(status=BookingStatus.CONFIRMED)
    for booking in bookings:
        start = booking_starts_at(booking)
        if start <= now:
            continue
        delta = start - now
        for window, (min_before, max_before) in REMINDER_WINDOWS.items():
            if min_before <= delta <= max_before:
                send_session_reminder(booking, window)


def start_scheduler() -> None:
    global _scheduler, _started
    if _started:
        return

    _scheduler = BackgroundScheduler(timezone=ZoneInfo("Asia/Kolkata"))
    _scheduler.add_job(
        process_session_reminders,
        trigger="interval",
        minutes=15,
        id="session-reminders",
        replace_existing=True,
    )
    _scheduler.start()
    _started = True
