from fastapi import FastAPI
from api.gsi import router as gsi_router
from api.websocket import router as ws_router

app = FastAPI()

app.include_router(gsi_router)
app.include_router(ws_router)
