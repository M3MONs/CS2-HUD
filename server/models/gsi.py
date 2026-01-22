from pydantic import BaseModel, ConfigDict
from typing import Any, Dict, Optional


class GSIBaseModel(BaseModel):
    model_config = ConfigDict(extra="ignore")


class PlayerState(GSIBaseModel):
    health: int
    armor: int
    helmet: bool
    flashed: int
    money: int
    round_kills: int
    equip_value: int
    smoked: Optional[int] = 0
    burning: Optional[int] = 0


class Weapon(GSIBaseModel):
    name: str
    type: str
    state: str
    ammo_clip: Optional[int] = None
    ammo_clip_max: Optional[int] = None
    ammo_reserve: Optional[int] = None


class Player(GSIBaseModel):
    steamid: str
    name: str
    team: Optional[str] = None
    state: PlayerState
    weapons: Optional[Dict[str, Weapon]] = None
    match_stats: Optional[Dict[str, int]] = None
    observer_slot: Optional[int] = None


class MapState(GSIBaseModel):
    name: str
    phase: str
    team_ct: Dict[str, Any]
    team_t: Dict[str, Any]


class GSIPayload(GSIBaseModel):
    provider: Dict[str, Any]
    map: Optional[MapState] = None
    player: Optional[Player] = None
    allplayers: Optional[Dict[str, Player]] = None
    bomb: Optional[Dict[str, Any]] = None
    round: Optional[Dict[str, Any]] = None
    phase_countdowns: Optional[Dict[str, Any]] = None
