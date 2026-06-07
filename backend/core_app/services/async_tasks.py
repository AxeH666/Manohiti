from __future__ import annotations

import logging
import threading
from collections.abc import Callable
from typing import ParamSpec, TypeVar

from django.db import close_old_connections

from core_app.services.booking_dispatch import dispatch_booking_confirmation

logger = logging.getLogger(__name__)

P = ParamSpec("P")
T = TypeVar("T")


def run_in_background(func: Callable[P, T], *args: P.args, **kwargs: P.kwargs) -> None:
    def _wrapper() -> None:
        close_old_connections()
        try:
            func(*args, **kwargs)
        except Exception:
            logger.exception("Background task failed: %s", func.__name__)
        finally:
            close_old_connections()

    thread = threading.Thread(target=_wrapper)
    thread.start()


def schedule_booking_confirmation_email(booking_id: int) -> None:
    run_in_background(dispatch_booking_confirmation, booking_id)
