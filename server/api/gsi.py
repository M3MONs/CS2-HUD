from http import HTTPStatus
from fastapi import APIRouter
from fastapi.requests import Request
from core.state import game_state_store
from models.gsi import GSIPayload
from pydantic import ValidationError

router = APIRouter()


@router.post("/gsi")
async def update_gsi(request: Request) -> HTTPStatus:
    raw_data = await request.json()
    try:
        payload = GSIPayload(**raw_data)
        data_to_store = payload.model_dump(exclude_unset=True)
        game_state_store.update(data_to_store)
    except ValidationError as e:
        print("Validation error:", e)
        game_state_store.update(raw_data)

    return HTTPStatus.OK
