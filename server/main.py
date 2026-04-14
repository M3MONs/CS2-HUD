from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.gsi import router as gsi_router, _tasks as gsi_tasks
from api.websocket import router as ws_router
from api.config import router as config_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    yield
    for task in list(gsi_tasks):
        task.cancel()


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(gsi_router)
app.include_router(ws_router)
app.include_router(config_router)