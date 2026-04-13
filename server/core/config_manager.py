import json
import logging
from pathlib import Path
from threading import RLock

from models.config import HudConfig, HudTheme

CONFIG_PATH = Path(__file__).parent.parent / "config.json"


class ConfigManager:
    """Manages the HUD configuration, providing thread-safe access and modification."""

    def __init__(self) -> None:
        self._lock = RLock()
        self._config = self._load()

    def _load(self) -> HudConfig:
        """Loads the HUD configuration from the JSON file."""
        if CONFIG_PATH.exists():
            try:
                with open(CONFIG_PATH, "r") as f:
                    data = json.load(f)
                    return HudConfig(**data)
            except Exception as e:
                logging.error(f"Error loading config: {e}")
        default = HudConfig()
        try:
            CONFIG_PATH.write_text(default.model_dump_json(indent=2), encoding="utf-8")
        except Exception as e:
            logging.warning(f"Could not write default config to disk: {e}")
        return default

    def save(self) -> None:
        """Saves the current HUD configuration to the JSON file."""
        with self._lock:
            try:
                CONFIG_PATH.write_text(
                    self._config.model_dump_json(indent=2),
                    encoding="utf-8",
                )
            except Exception as e:
                logging.error(f"Error saving config: {e}")

    def get(self) -> HudConfig:
        """Returns a deep copy of the current HUD configuration."""
        with self._lock:
            return self._config.model_copy(deep=True)

    def get_theme(self, theme_id: str) -> HudTheme | None:
        """Returns the theme matching *theme_id*, or None if not found."""
        with self._lock:
            for theme in self._config.themes:
                if theme.id == theme_id:
                    return theme.model_copy(deep=True)
            return None

    def update(self, new_config: HudConfig) -> HudConfig:
        """Replaces the current HUD configuration with a new one.

        Raises:
            ValueError: if cross-field constraints are violated.
        """
        self._validate_integrity(new_config)
        with self._lock:
            self._config = new_config
            self.save()
            return self._config.model_copy(deep=True)

    def patch(self, partial_config: dict) -> HudConfig:
        """Updates the current HUD configuration with a partial configuration.

        Raises:
            ValueError: if the resulting config violates cross-field constraints.
        """
        with self._lock:
            current_data = self._config.model_dump()
            merged = ConfigManager._deep_merge(current_data, partial_config)
            candidate = HudConfig(**merged)
            self._validate_integrity(candidate)
            self._config = candidate
            self.save()
            return self._config.model_copy(deep=True)

    @staticmethod
    def _validate_integrity(config: HudConfig) -> None:
        """Validates cross-field constraints on *config*.

        Raises:
            ValueError: if theme IDs are not unique or active_theme_id is dangling.
        """
        ids = [t.id for t in config.themes]
        if len(ids) != len(set(ids)):
            raise ValueError("Theme IDs must be unique")
        if config.active_theme_id not in ids:
            raise ValueError(
                f"active_theme_id '{config.active_theme_id}' does not reference any theme"
            )

    @staticmethod
    def _deep_merge(base: dict, updates: dict) -> dict:
        """Recursively merges two dictionaries."""
        for key, value in updates.items():
            if isinstance(value, dict) and key in base and isinstance(base[key], dict):
                base[key] = ConfigManager._deep_merge(base[key], value)
            else:
                base[key] = value
        return base


config_manager = ConfigManager()
