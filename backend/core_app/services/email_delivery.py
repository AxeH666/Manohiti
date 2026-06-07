from __future__ import annotations

import base64
import json
import os
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

from django.conf import settings
from django.core.mail import EmailMessage, EmailMultiAlternatives


def _sender_email() -> str:
    return os.getenv("EMAIL_FROM") or settings.DEFAULT_FROM_EMAIL or ""


def _send_smtp_email(
    recipient: str,
    subject: str,
    body: str,
    ics_content: str | None = None,
) -> None:
    if ics_content:
        message = EmailMultiAlternatives(
            subject=subject,
            body=body,
            from_email=_sender_email(),
            to=[recipient],
        )
        message.attach_alternative(
            ics_content,
            "text/calendar; method=PUBLISH; charset=UTF-8",
        )
    else:
        message = EmailMessage(
            subject=subject,
            body=body,
            from_email=_sender_email(),
            to=[recipient],
        )
    message.send(fail_silently=False)


def _post_json(url: str, headers: dict[str, str], payload: dict[str, object]) -> None:
    request = Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={**headers, "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urlopen(request, timeout=settings.EMAIL_TIMEOUT) as response:
            if response.status >= 400:
                raise RuntimeError(f"Email API returned HTTP {response.status}")
    except HTTPError as exc:
        detail = exc.read().decode("utf-8", errors="replace")
        raise RuntimeError(f"Email API returned HTTP {exc.code}: {detail}") from exc
    except URLError as exc:
        raise RuntimeError(f"Email API request failed: {exc.reason}") from exc


def _send_brevo_email(
    recipient: str,
    subject: str,
    body: str,
    ics_content: str | None = None,
) -> None:
    api_key = os.getenv("BREVO_API_KEY", "")
    if not api_key:
        raise RuntimeError("BREVO_API_KEY is not configured")

    payload: dict[str, object] = {
        "sender": {
            "name": os.getenv("EMAIL_FROM_NAME", "Manohiti"),
            "email": _sender_email(),
        },
        "to": [{"email": recipient}],
        "subject": subject,
        "textContent": body,
    }
    if ics_content:
        payload["attachment"] = [
            {
                "name": "manohiti-session.ics",
                "content": base64.b64encode(ics_content.encode("utf-8")).decode("ascii"),
            }
        ]

    _post_json(
        "https://api.brevo.com/v3/smtp/email",
        {"api-key": api_key},
        payload,
    )


def _send_resend_email(
    recipient: str,
    subject: str,
    body: str,
    ics_content: str | None = None,
) -> None:
    api_key = os.getenv("RESEND_API_KEY", "")
    if not api_key:
        raise RuntimeError("RESEND_API_KEY is not configured")

    payload: dict[str, object] = {
        "from": os.getenv("RESEND_FROM_EMAIL") or _sender_email(),
        "to": [recipient],
        "subject": subject,
        "text": body,
    }
    if ics_content:
        payload["attachments"] = [
            {
                "filename": "manohiti-session.ics",
                "content": base64.b64encode(ics_content.encode("utf-8")).decode("ascii"),
            }
        ]

    _post_json(
        "https://api.resend.com/emails",
        {"Authorization": f"Bearer {api_key}"},
        payload,
    )


def send_email(
    recipient: str,
    subject: str,
    body: str,
    ics_content: str | None = None,
) -> None:
    provider = os.getenv("EMAIL_PROVIDER", "smtp").strip().lower()
    if provider == "brevo":
        _send_brevo_email(recipient, subject, body, ics_content)
        return
    if provider == "resend":
        _send_resend_email(recipient, subject, body, ics_content)
        return
    _send_smtp_email(recipient, subject, body, ics_content)
