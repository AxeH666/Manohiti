from __future__ import annotations

import os
from datetime import time

from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives

from core_app.models import Booking, NotificationLog
from core_app.services.calendar import build_google_calendar_url, build_ics_invite
from core_app.services.whatsapp import is_whatsapp_enabled, send_whatsapp_text


def _format_time(value: time) -> str:
    return value.strftime("%I:%M %p").lstrip("0")


def _format_date(booking: Booking) -> str:
    return booking.slot_date.strftime("%A, %d %B %Y")


def _notification_already_sent(
    booking: Booking, channel: str, subject: str, recipient: str
) -> bool:
    return NotificationLog.objects.filter(
        booking=booking,
        channel=channel,
        subject=subject,
        recipient=recipient,
        status="sent",
    ).exists()


def _log_notification(
    booking: Booking,
    channel: str,
    recipient: str,
    subject: str,
    status: str,
    error_message: str = "",
) -> None:
    try:
        NotificationLog.objects.create(
            booking=booking,
            channel=channel,
            recipient=recipient,
            subject=subject,
            status=status,
            error_message=error_message or None,
        )
    except Exception:
        return


def _send_email(
    booking: Booking,
    recipient: str,
    subject_key: str,
    subject_display: str,
    body: str,
    ics_content: str | None = None,
) -> None:
    if _notification_already_sent(booking, "email", subject_key, recipient):
        return

    try:
        if ics_content:
            message = EmailMultiAlternatives(
                subject=subject_display,
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
            )
            message.attach_alternative(
                ics_content,
                "text/calendar; method=PUBLISH; charset=UTF-8",
            )
        else:
            message = EmailMessage(
                subject=subject_display,
                body=body,
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=[recipient],
            )
        message.send(fail_silently=False)
        _log_notification(booking, "email", recipient, subject_key, "sent")
    except Exception as exc:
        _log_notification(
            booking, "email", recipient, subject_key, "failed", str(exc)
        )


def _send_whatsapp(
    booking: Booking,
    recipient_phone: str,
    subject_key: str,
    body: str,
) -> None:
    if not recipient_phone.strip():
        return
    if _notification_already_sent(booking, "whatsapp", subject_key, recipient_phone):
        return

    success, error = send_whatsapp_text(recipient_phone, body)
    if success:
        _log_notification(booking, "whatsapp", recipient_phone, subject_key, "sent")
    else:
        _log_notification(
            booking, "whatsapp", recipient_phone, subject_key, "failed", error
        )


def send_booking_confirmation(booking: Booking) -> None:
    therapist_email = os.getenv("THERAPIST_EMAIL", "")
    # ORGANIZER must match the sending Gmail account or clients reject the invite.
    organizer = settings.DEFAULT_FROM_EMAIL or therapist_email or "heti3215@gmail.com"
    ics = build_ics_invite(booking, organizer)
    calendar_url = build_google_calendar_url(booking)

    client_subject_key = "booking_confirmation_client"
    client_body = (
        f"Hi {booking.client_name},\n\n"
        "Your session is confirmed.\n\n"
        f"Date: {_format_date(booking)}\n"
        f"Time: {_format_time(booking.slot_time)} (IST)\n"
        f"Duration: {booking.duration_minutes} minutes\n\n"
        "Add to Google Calendar:\n"
        f"{calendar_url}\n\n"
        "Gmail may also show an \"Add to Calendar\" banner above this message.\n"
        "Do not open a downloaded .ics file on Windows — it may launch Outlook.\n\n"
        "Warmly,\n"
        "Manohiti"
    )
    _send_email(
        booking,
        booking.client_email,
        client_subject_key,
        "Your session with Heti Mehra is confirmed",
        client_body,
        ics_content=ics,
    )

    if therapist_email:
        therapist_subject_key = "booking_confirmation_therapist"
        therapist_body = (
            "A new session has been booked.\n\n"
            f"Client: {booking.client_name}\n"
            f"Email: {booking.client_email}\n"
            f"Phone: {booking.client_phone or 'Not provided'}\n"
            f"Date: {_format_date(booking)}\n"
            f"Time: {_format_time(booking.slot_time)} (IST)\n"
            f"Notes: {booking.notes or 'No notes left'}\n"
        )
        _send_email(
            booking,
            therapist_email,
            therapist_subject_key,
            "New session booked",
            therapist_body,
            ics_content=ics,
        )

    if is_whatsapp_enabled() and booking.client_phone:
        wa_client_body = (
            f"Hi {booking.client_name}, your Manohiti therapy session is confirmed for "
            f"{_format_date(booking)} at {_format_time(booking.slot_time)} IST."
        )
        _send_whatsapp(
            booking,
            booking.client_phone,
            "booking_confirmation_client",
            wa_client_body,
        )

    therapist_wa = os.getenv("THERAPIST_WHATSAPP_NUMBER", "")
    if is_whatsapp_enabled() and therapist_wa:
        wa_therapist_body = (
            f"New booking: {booking.client_name} on {_format_date(booking)} at "
            f"{_format_time(booking.slot_time)} IST. Email: {booking.client_email}"
        )
        _send_whatsapp(
            booking,
            therapist_wa,
            "booking_confirmation_therapist",
            wa_therapist_body,
        )


def send_session_reminder(booking: Booking, window: str) -> None:
    """
    window: '24h' or '1h'
    """
    if window not in ("24h", "1h"):
        raise ValueError(f"Invalid reminder window: {window}")

    label = "24 hours" if window == "24h" else "1 hour"
    client_subject_key = f"reminder_{window}_client"
    therapist_subject_key = f"reminder_{window}_therapist"

    client_email_body = (
        f"Hi {booking.client_name},\n\n"
        f"Reminder: your therapy session with Heti Mehra is in about {label}.\n\n"
        f"Date: {_format_date(booking)}\n"
        f"Time: {_format_time(booking.slot_time)} (IST)\n"
        f"Duration: {booking.duration_minutes} minutes\n\n"
        "Warmly,\n"
        "Manohiti"
    )
    _send_email(
        booking,
        booking.client_email,
        client_subject_key,
        f"Reminder: session in {label}",
        client_email_body,
    )

    therapist_email = os.getenv("THERAPIST_EMAIL", "")
    if therapist_email:
        therapist_email_body = (
            f"Reminder: session with {booking.client_name} in about {label}.\n\n"
            f"Date: {_format_date(booking)}\n"
            f"Time: {_format_time(booking.slot_time)} (IST)\n"
        )
        _send_email(
            booking,
            therapist_email,
            therapist_subject_key,
            f"Reminder: session in {label} with {booking.client_name}",
            therapist_email_body,
        )

    if is_whatsapp_enabled() and booking.client_phone:
        wa_client = (
            f"Reminder: your Manohiti session is in about {label} — "
            f"{_format_date(booking)} at {_format_time(booking.slot_time)} IST."
        )
        _send_whatsapp(booking, booking.client_phone, client_subject_key, wa_client)

    therapist_wa = os.getenv("THERAPIST_WHATSAPP_NUMBER", "")
    if is_whatsapp_enabled() and therapist_wa:
        wa_therapist = (
            f"Reminder: session with {booking.client_name} in about {label} — "
            f"{_format_time(booking.slot_time)} IST on {_format_date(booking)}."
        )
        _send_whatsapp(booking, therapist_wa, therapist_subject_key, wa_therapist)
