import type { MapCalibration } from "./types";

export const PHASE_L: Record<string, string> = {
    freezetime: "FREEZE",
    live: "LIVE",
    over: "OVER",
    warmup: "WARMUP",
    intermission: "HALF",
    gameover: "END",
    bomb: "...",
};

/**
 * Map calibration data keyed by normalized map name.
 * posX/posY are the world-space top-left origin; scale is world units per radar pixel.
 */
export const MAP_CALIBRATION: Record<string, MapCalibration> = {
    de_ancient: { posX: -2953, posY: 2164, scale: 5 },
    de_anubis: { posX: -2796, posY: 3328, scale: 5.22 },
    de_dust2: { posX: -2476, posY: 3239, scale: 4.4 },
    de_inferno: { posX: -2087, posY: 3870, scale: 4.9 },
    de_mirage: { posX: -3230, posY: 1713, scale: 5 },
    de_nuke: { posX: -3453, posY: 2887, scale: 7 },
    de_overpass: { posX: -4831, posY: 1781, scale: 5.2 },
    de_train: { posX: -2477, posY: 2392, scale: 4.7 },
    de_vertigo: { posX: -3168, posY: 1762, scale: 4 },
};

/** Width/height in pixels of the radar image used for coordinate conversion. */
export const RADAR_SIZE = 1024;

/** Linear interpolation factor for player/bomb marker movement per animation frame. */
export const LERP = 0.12;

/** Linear interpolation factor for live-bounds adjustment per animation frame. */
export const LERP_BOUNDS = 0.1;

/** Minimum position delta (in radar %) below which movement snaps instead of interpolating. */
export const MOVE_THRESHOLD = 0.02;

/** Duration in milliseconds for which a player is considered "shooting" after ammo drop. */
export const SHOOTING_TTL_MS = 150;
