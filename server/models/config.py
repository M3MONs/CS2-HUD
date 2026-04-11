import re

from pydantic import BaseModel, Field, field_validator


class HudElementVisibility(BaseModel):
    """Defines which HUD elements are visible in the overlay."""
    scoreboard: bool = True
    player_stats: bool = True
    killfeed: bool = True
    minmap: bool = True
    bomb_timer: bool = True
    round_info: bool = True
    team_economy: bool = True
    phase_countdown: bool = True
    player_inventory: bool = True


class ThemeColors(BaseModel):
    """Defines the color scheme for a HUD theme."""
    ct_primary: str = "#5B9BD5"
    t_primary: str = "#E6C04E"
    background: str = "rgba(0,0,0,0.75)"
    text: str = "#FFFFFF"
    accent: str = "#FF6B00"
    health_bar: str = "#4ADE80"
    armor_bar: str = "#60A5FA"


class HudTheme(BaseModel):
    """Defines a HUD theme with its properties."""
    id: str
    name: str = "Classic"
    colors: ThemeColors = Field(default_factory=ThemeColors)
    font: str = "Inter"
    border_radius: str = "4px"
    opacity: float = 0.9

    @field_validator("id")
    @classmethod
    def validate_id(cls, v: str) -> str:
        if not re.fullmatch(r"[a-z0-9][a-z0-9_-]{0,63}", v):
            raise ValueError(
                "Theme ID must be 1–64 characters, start with a letter or digit, "
                "and contain only lowercase letters, digits, hyphens, or underscores"
            )
        return v


class HudConfig(BaseModel):
    """Defines the overall HUD configuration."""
    elements: HudElementVisibility = Field(default_factory=HudElementVisibility)
    active_theme_id: str = "classic"
    themes: list[HudTheme] = Field(default_factory=lambda: [HudTheme(id="classic")])
