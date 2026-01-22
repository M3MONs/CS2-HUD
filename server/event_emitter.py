from threading import Lock
from typing import Any, List, Callable


class EventEmitter:
    """
    Thread-safe event emitter for managing subscribers and emitting events.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._subscribers: List[Callable[[Any], None]] = []

    def subscribe(self, callback: Callable[[Any], None]) -> None:
        with self._lock:
            self._subscribers.append(callback)

    def unsubscribe(self, callback: Callable[[Any], None]) -> None:
        with self._lock:
            if callback in self._subscribers:
                self._subscribers.remove(callback)

    def emit(self, data: Any) -> None:
        with self._lock:
            current_subscribers = list(self._subscribers)

        for callback in current_subscribers:
            callback(data)
