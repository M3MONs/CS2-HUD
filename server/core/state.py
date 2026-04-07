from threading import Lock
from typing import Any, Dict
from core.event_emitter import EventEmitter


class GameStateStore:
    """
    Thread-safe store for the latest game state.
    """

    def __init__(self) -> None:
        self._lock = Lock()
        self._state: Dict[str, Any] = {}
        self.events = EventEmitter()

    def update(self, new_state: Dict[str, Any]) -> None:
        with self._lock:
            self._state = new_state

        self.events.emit(new_state)

    def snapshot(self) -> Dict[str, Any]:
        with self._lock:
            return self._state.copy()


game_state_store = GameStateStore()
