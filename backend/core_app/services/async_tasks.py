from __future__ import annotations

import logging
import threading
from collections.abc import Callable
from typing import ParamSpec, TypeVar

from django.db import close_old_connections

P = ParamSpec("P")
T = TypeVar("T")

logger = logging.getLogger(__name__)


def run_in_background(func: Callable[P, T], *args: P.args, **kwargs: P.kwargs) -> None:
    """Run a callable in a daemon thread so HTTP responses are not blocked."""

    def _wrapper() -> None:
        close_old_connections()
        try:
            func(*args, **kwargs)
        except Exception:
            logger.exception("Background task failed: %s", func.__name__)
        finally:
            close_old_connections()

    thread = threading.Thread(target=_wrapper, daemon=True)
    thread.start()
