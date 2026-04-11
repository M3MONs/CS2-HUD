from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.gsi import router as gsi_router
from api.websocket import router as ws_router
from api.config import router as config_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gsi_router)
app.include_router(ws_router)
app.include_router(config_router)