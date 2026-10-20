import re
from typing import Annotated

from pydantic import BaseModel, Field, StringConstraints, field_validator


class HudElementVisibility(BaseModel):
    """Defines which HUD elements are visible in the overlay."""
    scoreboard: bool = True
    player_stats: bool = True
    minimap: bool = True
    bomb_timer: bool = True
    team_economy: bool = True
    phase_countdown: bool = True


class ThemeColors(BaseModel):
    """Defines the color scheme for a HUD theme."""
    ct_primary: str = "#5B9BD5"
    t_primary: str = "#E6C04E"
    background: str = "rgba(0,0,0,0.75)"
    text: str = "#FFFFFF"
    accent: str = "#FF6B00"
    health_bar: str = "#4ADE80"
    armor_bar: str = "#60A5FA"


class ElementPosition(BaseModel):
    """Viewport-relative position of a HUD widget (percentages)."""
    x: float = Field(default=0, ge=0, le=100)
    y: float = Field(default=0, ge=0, le=100)


class ThemeLayout(BaseModel):
    """Per-theme positions for movable HUD widgets."""
    scoreboard: ElementPosition = Field(default_factory=lambda: ElementPosition(x=50, y=0))
    bomb_timer: ElementPosition = Field(default_factory=lambda: ElementPosition(x=50, y=7))
    team_ct: ElementPosition = Field(default_factory=lambda: ElementPosition(x=0, y=100))
    team_t: ElementPosition = Field(default_factory=lambda: ElementPosition(x=100, y=100))
    minimap: ElementPosition = Field(default_factory=lambda: ElementPosition(x=1, y=2))


VariantId = Annotated[str, StringConstraints(pattern=r"^[a-z0-9][a-z0-9_-]{0,63}$")]


class ThemeVariants(BaseModel):
    """Selected appearance variant per swappable HUD component.

    Variants are registered client-side; the server only stores the chosen id.
    """
    scoreboard: VariantId = "default"
    player_stats: VariantId = "default"
    bomb_timer: VariantId = "default"
    team_economy: VariantId = "default"
    phase_countdown: VariantId = "default"


class HudTheme(BaseModel):
    """Defines a HUD theme with its properties."""
    id: str
    name: str = "Classic"
    colors: ThemeColors = Field(default_factory=ThemeColors)
    font: str = "Inter"
    border_radius: str = "4px"
    opacity: float = 0.9
    layout: ThemeLayout = Field(default_factory=ThemeLayout)
    variants: ThemeVariants = Field(default_factory=ThemeVariants)

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
