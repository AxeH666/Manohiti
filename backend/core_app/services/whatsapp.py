from __future__ import annotations

import os
import re
from typing import Any

import requests

META_GRAPH_URL = "https://graph.facebook.com/v21.0"


def is_whatsapp_enabled() -> bool:
    return os.getenv("WHATSAPP_ENABLED", "False").lower() in ("true", "1", "yes")


def normalize_phone_e164(raw: str) -> str:
    """Strip spaces/dashes; ensure leading + for E.164-ish numbers."""
    digits = re.sub(r"[^\d+]", "", raw.strip())
    if not digits:
        return ""
    if digits.startswith("+"):
        return digits
    if digits.startswith("91") and len(digits) >= 12:
        return f"+{digits}"
    if len(digits) == 10:
        return f"+91{digits}"
    return f"+{digits}"


def send_whatsapp_text(to_phone: str, body: str) -> tuple[bool, str]:
    """
    Send a plain text WhatsApp message via Meta Cloud API.
    Returns (success, error_message_or_empty).
    """
    if not is_whatsapp_enabled():
        return False, "WhatsApp disabled (WHATSAPP_ENABLED=False)"

    token = os.getenv("WHATSAPP_ACCESS_TOKEN", "")
    phone_number_id = os.getenv("WHATSAPP_PHONE_NUMBER_ID", "")
    if not token or not phone_number_id:
        return False, "Missing WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID"

    recipient = normalize_phone_e164(to_phone)
    if not recipient:
        return False, "Invalid recipient phone number"

    url = f"{META_GRAPH_URL}/{phone_number_id}/messages"
    payload: dict[str, Any] = {
        "messaging_product": "whatsapp",
        "recipient_type": "individual",
        "to": recipient.lstrip("+"),
        "type": "text",
        "text": {"preview_url": False, "body": body},
    }
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(url, json=payload, headers=headers, timeout=30)
        if response.status_code >= 400:
            return False, response.text
        return True, ""
    except requests.RequestException as exc:
        return False, str(exc)
