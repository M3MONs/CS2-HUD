from fastapi import FastAPI
from fastapi.requests import Request
from fastapi.responses import JSONResponse
from state import game_state_store

app = FastAPI()

@app.post("/gsi")
async def gsi(request: Request) -> dict[str, str]:
    payload = await request.json()
    game_state_store.update(payload)
    return {"status": "ok"}

@app.get("/api/state")
def state() -> JSONResponse:
    return JSONResponse(game_state_store.snapshot())
