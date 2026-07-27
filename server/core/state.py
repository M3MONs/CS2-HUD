from threading import Lock
from typing import Any

from core.event_emitter import EventEmitter


def _deep_merge(base: dict[str, Any], delta: dict[str, Any]) -> dict[str, Any]:
    result = base.copy()
    for key, value in delta.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = _deep_merge(result[key], value)
        else:
            result[key] = value
    return result


class GameStateStore:
    """
    Thread-safe store for the latest game state.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._state: dict[str, Any] = {}
        self.events = EventEmitter()

    def update(self, new_state: dict[str, Any]) -> None:
        """Merges delta payload into current state and emits an event to notify subscribers."""
        with self._lock:
            self._state = _deep_merge(self._state, new_state)
            merged = self._state.copy()

        self.events.emit(merged)

    def snapshot(self) -> dict[str, Any]:
        """Returns a copy of the current game state."""
        with self._lock:
            return self._state.copy()


game_state_store = GameStateStore()
