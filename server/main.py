import sys
from contextlib import asynccontextmanager
from pathlib import Path

from api.config import router as config_router
from api.gsi import _tasks as gsi_tasks
from api.gsi import router as gsi_router
from api.websocket import router as ws_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

if getattr(sys, "frozen", False):
    BASE_DIR = Path(sys._MEIPASS)  # type: ignore
else:
    BASE_DIR = Path(__file__).parent
BUILD_DIR = BASE_DIR / "static"


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

if BUILD_DIR.exists():
    app.mount("/assets", StaticFiles(directory=BUILD_DIR / "assets"), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def spa_fallback(full_path: str):
        return FileResponse(BUILD_DIR / "index.html")


if __name__ == "__main__":
    import threading
    import webbrowser

    import pystray
    import uvicorn
    from PIL import Image, ImageDraw

    PORT = 8000

    def make_icon():
        img = Image.new("RGB", (64, 64), color=(20, 20, 20))
        d = ImageDraw.Draw(img)
        d.ellipse([8, 8, 56, 56], fill=(80, 180, 80))
        return img

    server = uvicorn.Server(uvicorn.Config(app, host="0.0.0.0", port=PORT, log_config=None))

    def run_server():
        server.run()

    thread = threading.Thread(target=run_server, daemon=True)
    thread.start()

    def on_open(icon, item):
        webbrowser.open(f"http://localhost:{PORT}")

    def on_quit(icon, item):
        server.should_exit = True
        icon.stop()

    tray = pystray.Icon(
        "CS2 HUD",
        make_icon(),
        "CS2 HUD",
        menu=pystray.Menu(
            pystray.MenuItem(
                f"Open localhost:{PORT}",
                on_open,
                default=True,
            ),
            pystray.MenuItem("Quit", on_quit),
        ),
    )
    tray.run()
