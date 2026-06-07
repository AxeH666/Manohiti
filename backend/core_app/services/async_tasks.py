from __future__ import annotations

import logging
import os
import subprocess
import sys
from pathlib import Path

from django.conf import settings

logger = logging.getLogger(__name__)


def schedule_booking_confirmation_email(booking_id: int) -> None:
    """
    Send confirmation email in a separate process.

    Gunicorn daemon threads cannot reliably reach Gmail SMTP on Railway
    ([Errno 101] Network is unreachable). A child process matches CLI behaviour.
    """
    manage_py = Path(settings.BASE_DIR) / "manage.py"
    try:
        subprocess.Popen(
            [
                sys.executable,
                str(manage_py),
                "send_booking_confirmation_email",
                str(booking_id),
            ],
            cwd=str(settings.BASE_DIR),
            env=os.environ.copy(),
            stdout=subprocess.DEVNULL,
            stderr=subprocess.DEVNULL,
            start_new_session=True,
        )
    except Exception:
        logger.exception(
            "Failed to spawn booking confirmation email for booking %s", booking_id
        )
