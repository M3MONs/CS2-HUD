from collections.abc import Callable
from threading import Lock
from typing import Any


class EventEmitter:
    """
    Thread-safe event emitter for managing subscribers and emitting events.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._subscribers: list[Callable[[Any], None]] = []

    def subscribe(self, callback: Callable[[Any], None]) -> None:
        """Adds a subscriber callback to be called when an event is emitted."""
        with self._lock:
            self._subscribers.append(callback)

    def unsubscribe(self, callback: Callable[[Any], None]) -> None:
        """Removes a subscriber callback."""
        with self._lock:
            if callback in self._subscribers:
                self._subscribers.remove(callback)

    def emit(self, data: Any) -> None:
        """Emits an event to all subscribers with the provided data."""
        with self._lock:
            current_subscribers = self._subscribers

        for callback in current_subscribers:
            callback(data)
