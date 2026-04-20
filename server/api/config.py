from fastapi import APIRouter, HTTPException
from models.config import HudConfig, HudTheme
from core.config_manager import config_manager

router = APIRouter(prefix="/api/config", tags=["config"])


def _get_theme_or_404(theme_id: str) -> HudTheme:
    """Returns the theme matching *theme_id*, or raises HTTP 404."""
    theme = config_manager.get_theme(theme_id)
    if theme is None:
        raise HTTPException(status_code=404, detail=f"Theme '{theme_id}' not found")
    return theme


@router.get("/", response_model=HudConfig)
async def get_config() -> HudConfig:
    """Retrieves the current HUD configuration."""
    return config_manager.get()


@router.put("/", response_model=HudConfig)
async def update_config(new_config: HudConfig) -> HudConfig:
    """Replaces the current HUD configuration with a new one."""
    try:
        return config_manager.update(new_config)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))


@router.patch("/", response_model=HudConfig)
async def patch_config(partial_config: dict) -> HudConfig:
    """Updates the current HUD configuration with a partial configuration."""
    try:
        return config_manager.patch(partial_config)
    except ValueError as e:
        raise HTTPException(status_code=422, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/themes", response_model=HudConfig)
async def add_theme(theme: HudTheme) -> HudConfig:
    """Adds a new HUD theme to the configuration."""
    if config_manager.get_theme(theme.id) is not None:
        raise HTTPException(status_code=409, detail=f"Theme '{theme.id}' already exists")
    config = config_manager.get()
    config.themes.append(theme)
    config.active_theme_id = theme.id
    return config_manager.update(config)


@router.put("/themes/{theme_id}", response_model=HudConfig)
async def update_theme(theme_id: str, updated_theme: HudTheme) -> HudConfig:
    """Updates an existing HUD theme in the configuration."""
    if updated_theme.id != theme_id:
        raise HTTPException(
            status_code=422,
            detail="Theme ID in request body must match the path parameter",
        )
    _get_theme_or_404(theme_id)
    config = config_manager.get()
    config.themes = [updated_theme if t.id == theme_id else t for t in config.themes]
    return config_manager.update(config)


@router.delete("/themes/{theme_id}", response_model=HudConfig)
async def delete_theme(theme_id: str) -> HudConfig:
    """Deletes a HUD theme from the configuration."""
    if theme_id == "default":
        raise HTTPException(status_code=400, detail="Cannot delete the default theme")
    _get_theme_or_404(theme_id)
    config = config_manager.get()
    config.themes = [t for t in config.themes if t.id != theme_id]
    if config.active_theme_id == theme_id:
        config.active_theme_id = "default"
    return config_manager.update(config)
