import type { GSIPlayer, GSIPosition, GSIWeapon } from "@/types/gsi";
import type { ClassicPalette } from "./useClassicPalette";

type MapCalibration = {
    posX: number;
    posY: number;
    scale: number;
};

const MAP_CALIBRATION: Record<string, MapCalibration> = {
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

const RADAR_SIZE = 1024;

export function sorted(p: GSIPlayer[]) {
    return [...p].sort((a, b) => (a.observer_slot ?? 0) - (b.observer_slot ?? 0));
}

export function normalizeMapName(mapName: string | undefined) {
    if (!mapName) return "";
    const cleaned = mapName.trim().toLowerCase();
    if (!cleaned) return "";
    return cleaned.startsWith("de_") || cleaned.startsWith("cs_") || cleaned.startsWith("ar_")
        ? cleaned
        : `de_${cleaned}`;
}

export function radarImageUrl(mapName: string | undefined) {
    const normalized = normalizeMapName(mapName);
    if (!normalized) return "";
    return `https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/${normalized}_radar_psd.png`;
}

export function fallbackMapImageUrl(mapName: string | undefined) {
    const normalized = normalizeMapName(mapName);
    if (!normalized) return "";
    return `https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/${normalized}.png`;
}

export function parsePosition(position: GSIPlayer["position"] | string | undefined): GSIPosition | null {
    if (!position) return null;

    if (typeof position === "string") {
        const parts = position.split(",").map((n) => Number(n.trim()));
        if (parts.length < 2 || Number.isNaN(parts[0]) || Number.isNaN(parts[1])) return null;
        return { x: parts[0], y: parts[1], z: parts[2] };
    }

    if (Array.isArray(position)) {
        if (position.length < 2) return null;
        const x = Number(position[0]);
        const y = Number(position[1]);
        const z = position[2] !== undefined ? Number(position[2]) : undefined;
        if (Number.isNaN(x) || Number.isNaN(y)) return null;
        return { x, y, z };
    }

    if (typeof position === "object" && typeof position.x === "number" && typeof position.y === "number") {
        return { x: position.x, y: position.y, z: position.z };
    }

    return null;
}

export function worldToRadar(
    mapName: string | undefined,
    point: GSIPosition,
    liveBounds?: { minX: number; maxX: number; minY: number; maxY: number },
) {
    const normalized = normalizeMapName(mapName);
    const calibration = MAP_CALIBRATION[normalized];

    if (calibration) {
        const xPx = (point.x - calibration.posX) / calibration.scale;
        const yPx = (calibration.posY - point.y) / calibration.scale;
        return {
            x: Math.max(0, Math.min(100, (xPx / RADAR_SIZE) * 100)),
            y: Math.max(0, Math.min(100, (yPx / RADAR_SIZE) * 100)),
            calibrated: true,
        };
    }

    if (liveBounds && liveBounds.maxX > liveBounds.minX && liveBounds.maxY > liveBounds.minY) {
        const x = ((point.x - liveBounds.minX) / (liveBounds.maxX - liveBounds.minX)) * 100;
        const y = ((liveBounds.maxY - point.y) / (liveBounds.maxY - liveBounds.minY)) * 100;
        return {
            x: Math.max(2, Math.min(98, x)),
            y: Math.max(2, Math.min(98, y)),
            calibrated: false,
        };
    }

    return { x: 50, y: 50, calibrated: false };
}

export function pickActiveWeapon(player: GSIPlayer): GSIWeapon | null {
    const all = Object.values(player.weapons || {});
    if (all.length === 0) return null;
    return all.find((w) => w.state === "active") ?? all[0];
}

export function hpC(v: number, hp: ClassicPalette["hp"]) {
    return v > 60 ? hp.hi : v > 25 ? hp.mid : hp.lo;
}

export function wpn(p: GSIPlayer) {
    const ws = Object.values(p.weapons || {});
    const m = ws.find((w) => ["rifle", "sniperrifle", "submachinegun", "shotgun", "machinegun"].includes(w.type));
    const pi = ws.find((w) => w.type === "pistol");
    const pick = m || pi;
    if (!pick) return "";
    return (pick.name || "")
        .replace(/^weapon_/, "")
        .replace(/_/g, "")
        .toUpperCase();
}

export function tc(team: string, palette: ClassicPalette) {
    return team === "CT" ? palette.ct : palette.t;
}
