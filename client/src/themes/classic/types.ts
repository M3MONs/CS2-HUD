import type { ThemeProps } from "@/themes/registry";

export type RGBA = { r: number; g: number; b: number; a: number };

export type TeamPalette = {
    solid: string;
    grad: string;
    glow: string;
};

export interface ClassicPalette {
    ff: string;
    ct: TeamPalette;
    t: TeamPalette;
    hp: { hi: string; mid: string; lo: string };
    armor: string;
    accent: string;
    bg: string;
    div: string;
    /** Text at 100% opacity. */
    w: string;
    /** Text at 90% opacity. */
    w90: string;
    /** Text at 70% opacity. */
    w70: string;
    /** Text at 40% opacity. */
    w40: string;
    /** Text at 20% opacity. */
    w20: string;
    /** Text at 8% opacity. */
    w08: string;
    money: string;
    dead: string;
}

export type MapCalibration = {
    posX: number;
    posY: number;
    scale: number;
};

export type BombData = NonNullable<ThemeProps["data"]["bomb"]>;

export type RadarMapProps = {
    mapName?: string;
    players: import("@/types/gsi").GSIPlayer[];
    bombPosition?: string;
};

export type RadarMarker = {
    steamid: string;
    name: string;
    team: "CT" | "T";
    slot: number;
    wx: number;
    wy: number;
    wz?: number;
    health: number;
    flashed: boolean;
    bombCarrier: boolean;
};

export type RadarMarkerDotProps = {
    steamid: string;
    name: string;
    team: "CT" | "T";
    slot: number;
    flashed: boolean;
    shooting: boolean;
    bombCarrier: boolean;
    px: number;
    py: number;
};

export type PlantedBombProps = {
    x: number;
    y: number;
    vw: number;
    vh: number;
};

export type SmoothPos = { x: number; y: number };

export type SmoothBounds = { minX: number; maxX: number; minY: number; maxY: number };

export type RadarPos = { x: number; y: number };

export type Marker = {
    steamid: string;
    wx: number;
    wy: number;
    wz?: number;
};

export type SmoothRadarParams = {
    mapName?: string;
    markers: Marker[];
    bombRadarPos: RadarPos | null;
    liveBounds?: SmoothBounds;
};
