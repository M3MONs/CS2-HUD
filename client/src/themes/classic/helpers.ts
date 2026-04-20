import type { GSIPlayer, GSIPosition, GSIWeapon } from "@/types/gsi";
import type { RGBA, ClassicPalette, TeamPalette } from "./types";
import { MAP_CALIBRATION, RADAR_SIZE } from "./constants";

/**
 * Parse a color string into an RGBA object, supporting hex (#rgb, #rrggbb, #rrggbbaa) and rgb(a)() formats.
 * @param input The CSS color string to parse.
 * @returns An RGBA object if parsing succeeds, otherwise null.
 */
export function parseColor(input: string): RGBA | null {
    const s = input.trim();

    const hex = s.match(/^#([0-9a-fA-F]{3,8})$/);
    if (hex) {
        let h = hex[1];

        // Expand shorthand hex: 3 → 6, 4 → 8
        if (h.length === 3)
            h = h
                .split("")
                .map((c) => c + c)
                .join("");

        if (h.length === 4)
            h = h
                .split("")
                .map((c) => c + c)
                .join("");

        // Add implicit full alpha if not provided
        if (h.length === 6) h += "ff";
        if (h.length !== 8) return null;

        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: parseInt(h.slice(6, 8), 16) / 255,
        };
    }

    const rgb = s.match(/^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i);

    if (rgb) {
        const a = rgb[4] ? (rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : +rgb[4]) : 1;
        return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a };
    }

    return null;
}

/**
 * Return a color string with its alpha channel replaced by the given value.
 * Falls back to the original string if the color cannot be parsed.
 * @param color The input CSS color string.
 * @param alpha The desired alpha value in range [0, 1].
 * @returns An rgba() CSS string with the applied alpha.
 */
export function withAlpha(color: string, alpha: number): string {
    const c = parseColor(color);
    if (!c) return color;
    return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${alpha})`;
}

/**
 * Darken a color by reducing each RGB channel by a proportional amount.
 * Falls back to the original string if the color cannot be parsed.
 * @param color The input CSS color string.
 * @param amount Darkening factor in range [0, 1], e.g. 0.15 reduces channels by 15%.
 * @returns An rgba() CSS string of the darkened color.
 */
export function darken(color: string, amount: number): string {
    const c = parseColor(color);
    if (!c) return color;
    const f = 1 - amount;
    return `rgba(${Math.round(c.r * f)}, ${Math.round(c.g * f)}, ${Math.round(c.b * f)}, ${c.a})`;
}

/**
 * Generate a three-variant color palette for a team from its base color.
 * @param base The base CSS color string for the team.
 * @returns An object with solid fill, vertical gradient, and transparent glow variants.
 */
export function teamPalette(base: string): TeamPalette {
    return {
        solid: base,
        grad: `linear-gradient(180deg, ${base} 0%, ${darken(base, 0.15)} 100%)`,
        glow: withAlpha(base, 0.3),
    };
}

/**
 * Sort players by their observer slot, which generally corresponds to their position in the radar and UI.
 * @param p Array of GSIPlayer objects to be sorted.
 * @returns A new array of GSIPlayer objects sorted by their observer slot.
 */
export function sorted(p: GSIPlayer[]) {
    return [...p].sort((a, b) => (a.observer_slot ?? 0) - (b.observer_slot ?? 0));
}

/**
 * Pick the active weapon of a player, or fallback to the first available weapon.
 * @param player The player whose weapons are being evaluated.
 * @returns The active weapon, or the first available weapon if no active weapon is found.
 */
export function pickActiveWeapon(player: GSIPlayer): GSIWeapon | null {
    const all = Object.values(player.weapons || {});
    if (all.length === 0) return null;
    return all.find((w) => w.state === "active") ?? all[0];
}

/**
 * Determine the color based on the player's health.
 * @param v The player's health value.
 * @param hp The health color palette.
 * @returns The color corresponding to the player's health.
 */
export function hpC(v: number, hp: ClassicPalette["hp"]) {
    return v > 60 ? hp.hi : v > 25 ? hp.mid : hp.lo;
}

/**
 * Get a simplified weapon name for display purposes, prioritizing rifles, then pistols.
 * @param p The player whose weapons are being evaluated.
 * @returns The simplified weapon name, or an empty string if no suitable weapon is found.
 */
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

/**
 * Determine the color to use for a team based on its name, using the provided palette.
 * @param team The team name, expected to be "CT" or "T".
 * @param palette The color palette containing colors for both teams.
 * @returns The color corresponding to the team.
 */
export function tc(team: string, palette: ClassicPalette) {
    return team === "CT" ? palette.ct : palette.t;
}

/**
 * Normalize map names by trimming, converting to lowercase, and ensuring they start with a known prefix.
 * @param mapName The name of the map to normalize.
 * @returns The normalized map name.
 */
export function normalizeMapName(mapName: string | undefined) {
    if (!mapName) return "";
    const cleaned = mapName.trim().toLowerCase();
    if (!cleaned) return "";
    return cleaned.startsWith("de_") || cleaned.startsWith("cs_") || cleaned.startsWith("ar_")
        ? cleaned
        : `de_${cleaned}`;
}

/**
 * Generate the URL for the radar image based on the map name.
 * @param mapName The name of the map for which to generate the radar image URL.
 * @returns The URL of the radar image.
 */
export function radarImageUrl(mapName: string | undefined) {
    const normalized = normalizeMapName(mapName);
    if (!normalized) return "";
    return `https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/radars/${normalized}_radar_psd.png`;
}

/**
 * Generate the URL for the fallback map image based on the map name.
 * @param mapName The name of the map for which to generate the fallback map image URL.
 * @returns The URL of the fallback map image.
 */
export function fallbackMapImageUrl(mapName: string | undefined) {
    const normalized = normalizeMapName(mapName);
    if (!normalized) return "";
    return `https://raw.githubusercontent.com/MurkyYT/cs2-map-icons/main/images/${normalized}.png`;
}

/**
 * Parse a position from various formats (string, array, or object) into a standardized GSIPosition object.
 * @param position The position to parse, which can be a string, array, or object.
 * @returns A GSIPosition object if parsing is successful, otherwise null.
 */
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

/**
 * Convert world coordinates to radar coordinates using map calibration if available, or live bounds as a fallback.
 * For maps without calibration data, live player positions are used to estimate the visible area.
 * @param mapName The name of the map, used to determine if calibration data is available.
 * @param point The world coordinates to convert.
 * @param liveBounds The live bounds of the map, used if calibration data is not available.
 * @returns The radar coordinates as percentages [0–100] and whether calibration data was used.
 */
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

export const GRENADE_NAMES = ["flashbang", "smokegrenade", "hegrenade", "molotov", "incgrenade", "decoy"] as const;

/**
 * Return a map of grenade types to their counts for a given player, based on their weapons.
 * @param player The player whose grenades are being counted.
 * @returns A Map where keys are grenade types (e.g. "flashbang") and values are the counts of each grenade type the player has.
 */
export function collectGrenades(player: GSIPlayer): Map<string, number> {
    const result = new Map<string, number>();
    for (const w of Object.values(player.weapons ?? {})) {
        if (w.type.toLowerCase() !== "grenade") continue;
        if (w.state !== "active" && w.state !== "holstered") continue;
        const bare = w.name.replace(/^weapon_/, "");
        result.set(bare, (result.get(bare) ?? 0) + 1);
    }
    return result;
}
