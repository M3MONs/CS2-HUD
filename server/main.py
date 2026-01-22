import asyncio
from http import HTTPStatus
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.requests import Request
from state import game_state_store
from models.gsi import GSIPayload
from pydantic import ValidationError
from fastapi.background import BackgroundTasks

app = FastAPI()


@app.post("/gsi")
async def update_gsi(request: Request, background_tasks: BackgroundTasks):
    raw_data = await request.json()
    try:
        payload = GSIPayload(**raw_data)
        data_to_store = payload.model_dump(exclude_unset=True)
        background_tasks.add_task(game_state_store.update, data_to_store)
    except ValidationError as e:
        # TODO: log the validation error
        print("Validation error:", e)
        background_tasks.add_task(game_state_store.update, raw_data)

    return HTTPStatus.OK


@app.websocket("/ws")
async def ws_endpoint(ws: WebSocket) -> None:
    await ws.accept()

    await ws.send_json(game_state_store.snapshot())

    queue: asyncio.Queue = asyncio.Queue()

    def on_update(state: dict) -> None:
        queue.put_nowait(state)

    game_state_store.events.subscribe(on_update)

    try:
        while True:
            state = await queue.get()
            await ws.send_json(state)
    except WebSocketDisconnect:
        pass
    finally:
        game_state_store.events.unsubscribe(on_update)
