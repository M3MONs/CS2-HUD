import asyncio
import logging
from http import HTTPStatus

from core.avatar_cache import avatar_cache
from core.state import game_state_store
from fastapi import APIRouter
from fastapi.requests import Request
from models.gsi import GSIPayload
from pydantic import ValidationError

logger = logging.getLogger(__name__)
router = APIRouter()
_tasks: set[asyncio.Task] = set()


@router.post("/gsi")
async def update_gsi(request: Request) -> HTTPStatus:
    """Endpoint to receive game state updates from CS2's Game State Integration."""
    raw_data = await request.json()
    try:
        payload = GSIPayload(**raw_data)
        data_to_store = payload.model_dump(exclude_unset=True)
    except ValidationError as e:
        logger.error("Validation error: %s", e)
        data_to_store = raw_data

    if "allplayers" in data_to_store:
        steamids = list(data_to_store["allplayers"].keys())
        task = asyncio.create_task(avatar_cache.fetch(steamids))
        _tasks.add(task)
        task.add_done_callback(_tasks.discard)
        for steamid, player in data_to_store["allplayers"].items():
            player["steamid"] = steamid
            player["avatar"] = avatar_cache.get(steamid)

    game_state_store.update(data_to_store)
    return HTTPStatus.OK
