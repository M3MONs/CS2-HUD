import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from core.state import game_state_store

router = APIRouter()


@router.websocket("/ws")
async def ws_endpoint(ws: WebSocket) -> None:
    """WebSocket endpoint for clients to receive real-time game state updates."""
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
