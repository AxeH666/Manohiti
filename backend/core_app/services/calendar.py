from __future__ import annotations

from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from zoneinfo import ZoneInfo

from core_app.models import Booking

SESSION_TIMEZONE = ZoneInfo("Asia/Kolkata")


def _escape_ics_text(value: str) -> str:
    return (
        value.replace("\\", "\\\\")
        .replace(";", "\\;")
        .replace(",", "\\,")
        .replace("\n", "\\n")
    )


def _format_ics_local(value: datetime) -> str:
    return value.strftime("%Y%m%dT%H%M%S")


def _format_ics_utc(value: datetime) -> str:
    return value.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def booking_starts_at(booking: Booking) -> datetime:
    naive = datetime.combine(booking.slot_date, booking.slot_time)
    return naive.replace(tzinfo=SESSION_TIMEZONE)


def booking_ends_at(booking: Booking) -> datetime:
    return booking_starts_at(booking) + timedelta(minutes=booking.duration_minutes)


def build_google_calendar_url(booking: Booking) -> str:
    """Direct link for Gmail users — avoids .ics opening in Outlook on Windows."""
    start = booking_starts_at(booking)
    end = booking_ends_at(booking)
    params = {
        "action": "TEMPLATE",
        "text": "Therapy session with Heti Mehra",
        "dates": f"{_format_ics_local(start)}/{_format_ics_local(end)}",
        "ctz": "Asia/Kolkata",
        "details": (
            "Individual therapy session with Heti Mehra (Manohiti).\n"
            f"Client: {booking.client_name}\n"
            f"Duration: {booking.duration_minutes} minutes"
        ),
    }
    return f"https://calendar.google.com/calendar/render?{urlencode(params)}"


def build_ics_invite(booking: Booking, organizer_email: str) -> str:
    """Build RFC 5545 calendar event (METHOD:PUBLISH for confirmed bookings)."""
    start = booking_starts_at(booking)
    end = booking_ends_at(booking)
    uid = f"manohiti-booking-{booking.id}@manohiti.health"
    now = datetime.now(tz=timezone.utc)
    summary = _escape_ics_text("Therapy session with Heti Mehra")
    description = _escape_ics_text(
        "Individual therapy session with Heti Mehra (Manohiti).\n"
        f"Client: {booking.client_name}\n"
        f"Duration: {booking.duration_minutes} minutes"
    )
    lines = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//Manohiti//Booking//EN",
        "CALSCALE:GREGORIAN",
        "METHOD:PUBLISH",
        "BEGIN:VTIMEZONE",
        "TZID:Asia/Kolkata",
        "BEGIN:STANDARD",
        "DTSTART:19700101T000000",
        "TZOFFSETFROM:+0530",
        "TZOFFSETTO:+0530",
        "TZNAME:IST",
        "END:STANDARD",
        "END:VTIMEZONE",
        "BEGIN:VEVENT",
        f"UID:{uid}",
        f"DTSTAMP:{_format_ics_utc(now)}",
        f"DTSTART;TZID=Asia/Kolkata:{_format_ics_local(start)}",
        f"DTEND;TZID=Asia/Kolkata:{_format_ics_local(end)}",
        f"SUMMARY:{summary}",
        f"DESCRIPTION:{description}",
        f"ORGANIZER;CN=Heti Mehra:mailto:{organizer_email}",
        "STATUS:CONFIRMED",
        "TRANSP:OPAQUE",
        "SEQUENCE:0",
        "END:VEVENT",
        "END:VCALENDAR",
    ]
    return "\r\n".join(lines) + "\r\n"
