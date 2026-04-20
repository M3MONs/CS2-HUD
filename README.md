# CS2 HUD

A custom real-time HUD overlay for Counter-Strike 2, powered by Game State Integration (GSI). Features a Python (FastAPI) backend and a React (TypeScript) frontend connected via WebSocket for live game data streaming.

![React](https://img.shields.io/badge/React-19-blue?logo=react)
![FastAPI](https://img.shields.io/badge/FastAPI-0.128+-green?logo=fastapi)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)
![Python](https://img.shields.io/badge/Python-3.12+-yellow?logo=python)

## Features

- **Live scoreboard** — team names, scores, round number, phase timer, and overtime detection
- **Player cards** — Steam avatars, HP bars, armor status, active weapon, grenades, KDA, money
- **Radar minimap** — real-time player positions with smooth interpolation, shooting detection, and bomb marker
- **Bomb & defuse timers** — animated countdown bars with urgency indicators
- **Theming system** — customizable colors, fonts, border radius, and opacity with live preview
- **HUD element toggles** — show/hide individual elements (scoreboard, radar, bomb timer, etc.)
- **System tray app** — runs as a background application with a tray icon in production
- **OBS-ready** — open `/hud` in a browser source for stream overlays

## Architecture

```
┌─────────────┐    GSI POST     ┌─────────────────┐   WebSocket   ┌─────────────┐
│   CS2 Game  │ ──────────────► │  FastAPI Server │ ────────────► │ React Client│
│             │   :8000/gsi     │   (Python)      │   :8000/ws    │ (TypeScript)│
└─────────────┘                 └─────────────────┘               └─────────────┘
                                        │
                                   Serves SPA
                                  from /static
```

- **Single-process production**: Vite builds the client directly into `server/static/`, so the FastAPI server serves everything on one port.
- **Dev mode**: Vite dev server on `:5173` proxies `/api` and `/ws` to the backend on `:8000`.

## Prerequisites

- **Python** ≥ 3.12
- **Node.js** ≥ 18
- **uv** (recommended) or pip for Python dependency management
- **Counter-Strike 2**

## Setup

### 1. Install dependencies

```bash
# Server
cd server
uv sync

# Client
cd client
npm install
```

### 2. Configure CS2 Game State Integration

Create the following file:

```
<Steam>/steamapps/common/Counter-Strike Global Offensive/game/csgo/cfg/gamestate_integration_hud.cfg
```

With this content:

```
"CS2 HUD GSI"
{
    "uri"           "http://localhost:8000/gsi"
    "timeout"       "5.0"
    "buffer"        "0.1"
    "throttle"      "0.1"
    "heartbeat"     "10.0"
    "data"
    {
        "provider"               "1"
        "map"                    "1"
        "round"                  "1"
        "player_id"              "1"
        "allplayers_id"          "1"
        "player_state"           "1"
        "allplayers_state"       "1"
        "allplayers_match_stats" "1"
        "allplayers_weapons"     "1"
        "allplayers_position"    "1"
        "phase_countdowns"       "1"
        "bomb"                   "1"
    }
}
```

> **Note**: `allplayers_*` data requires spectator mode or launching CS2 with the `-netconport` launch option.

### 3. Run

**Development** (two terminals):

```bash
# Terminal 1 — Server
cd server
uv run uvicorn main:app --reload --port 8000

# Terminal 2 — Client
cd client
npm run dev
```

Open `http://localhost:5173` in your browser.

**Production**:

```bash
# Build client (outputs to server/static/)
cd client
npm run build

# Start server
cd server
python main.py
```

Open `http://localhost:8000`. The server runs with a system tray icon.

## Usage

| Page | URL | Description |
|------|-----|-------------|
| Home | `/` | Landing page with navigation |
| HUD Overlay | `/hud` | The live game overlay (use this as OBS browser source) |
| Settings | `/settings` | Configure HUD elements and themes |

### OBS Setup

1. Start the server
2. Add a **Browser Source** in OBS
3. Set the URL to `http://localhost:8000/hud`
4. Set resolution to match your stream (e.g., 1920×1080)

## Settings

### HUD Elements

Toggle visibility of individual overlay components:

| Element | Description |
|---------|-------------|
| Scoreboard | Team scores, round number, phase timer |
| Player Stats | Player cards with HP, armor, weapons |
| Killfeed | Kill notifications |
| Minimap | Radar with player positions |
| Bomb Timer | Bomb plant/defuse countdown |
| Round Info | Current round phase indicator |
| Team Economy | Team money display |
| Phase Countdown | Round phase timer |
| Player Inventory | Weapon and grenade slots |

### Themes

Create and customize themes with:

- **7 color channels** — CT primary, T primary, background, text, accent, health bar, armor bar
- **Font family** — any system or web font
- **Border radius** — corner rounding for UI elements
- **Opacity** — overall HUD transparency

## Supported Maps

The radar minimap includes calibration data for:

de_ancient, de_anubis, de_dust2, de_inferno, de_mirage, de_nuke, de_overpass, de_train, de_vertigo

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/gsi` | CS2 Game State Integration receiver |
| `WS` | `/ws` | WebSocket for real-time game state |
| `GET` | `/config/` | Get current HUD configuration |
| `PUT` | `/config/` | Replace full configuration |
| `PATCH` | `/config/` | Partial configuration update |
| `POST` | `/config/themes` | Create a new theme |
| `PUT` | `/config/themes/{id}` | Update a theme |
| `DELETE` | `/config/themes/{id}` | Delete a theme |

## Tech Stack

**Server**: Python, FastAPI, Uvicorn, Pydantic, pystray, Pillow, httpx

**Client**: React 19, TypeScript, Vite, Zustand, Tailwind CSS, Framer Motion, Axios, React Router

## Building Executable

The server can be packaged as a standalone executable using PyInstaller:

```bash
cd server
pyinstaller main.spec
```

The output will be in `server/dist/`.

## License

See [LICENSE](LICENSE) for details.
