from typing import Any

from pydantic import BaseModel, ConfigDict


class GSIBaseModel(BaseModel):
    model_config = ConfigDict(extra="ignore")


class PlayerState(GSIBaseModel):
    """Represents the state of a player in the game."""

    health: int
    armor: int
    helmet: bool
    flashed: int
    money: int
    round_kills: int
    equip_value: int
    smoked: int | None = 0
    burning: int | None = 0


class Weapon(GSIBaseModel):
    """Represents a weapon in the game."""

    name: str
    type: str
    state: str
    ammo_clip: int | None = None
    ammo_clip_max: int | None = None
    ammo_reserve: int | None = None


class Vec3(GSIBaseModel):
    """Represents 3D world coordinates."""

    x: float
    y: float
    z: float


class Player(GSIBaseModel):
    """Represents a player in the game."""

    steamid: str | None = None
    avatar: str | None = None
    name: str
    team: str | None = None
    state: PlayerState
    weapons: dict[str, Weapon] | None = None
    match_stats: dict[str, int] | None = None
    observer_slot: int | None = None
    position: str | Vec3 | list[float] | None = None
    forward: str | Vec3 | list[float] | None = None
    activity: str | None = None


class MapState(GSIBaseModel):
    """Represents the state of the map in the game."""

    name: str
    phase: str
    team_ct: dict[str, Any]
    team_t: dict[str, Any]


class GSIPayload(GSIBaseModel):
    """Represents the payload sent by CS2's Game State Integration."""

    provider: dict[str, Any]
    map: MapState | None = None
    player: Player | None = None
    allplayers: dict[str, Player] | None = None
    bomb: dict[str, Any] | None = None
    round: dict[str, Any] | None = None
    phase_countdowns: dict[str, Any] | None = None
