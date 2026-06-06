# Backward-compatible re-exports; use core_app.notifications for new code.
from core_app.notifications import send_booking_confirmation, send_session_reminder

__all__ = ["send_booking_confirmation", "send_session_reminder"]
