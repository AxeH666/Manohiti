from __future__ import annotations

import threading
from collections.abc import Callable
from typing import ParamSpec, TypeVar

P = ParamSpec("P")
T = TypeVar("T")


def run_in_background(func: Callable[P, T], *args: P.args, **kwargs: P.kwargs) -> None:
    """Run a callable in a daemon thread so HTTP responses are not blocked."""
    thread = threading.Thread(target=func, args=args, kwargs=kwargs, daemon=True)
    thread.start()
