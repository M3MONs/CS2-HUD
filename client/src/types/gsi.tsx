export interface GSIPayload {
    provider: any;
    map: GSIMap;
    round?: { phase: string; bomb?: string };
    player: GSIPlayer;
    allplayers?: Record<string, GSIPlayer>;
    bomb?: { state: string; position: string; countdown: string };
    phase_countdowns?: { phase: string; phase_ends_in: string };
}

export interface GSIPosition {
    x: number;
    y: number;
    z?: number;
}

export interface GSIWeapon {
    name: string;
    type: string;
    state: string;
    ammo_clip?: number;
    ammo_clip_max?: number;
    ammo_reserve?: number;
}

export interface GSIPlayer {
    steamid: string;
    avatar?: string;
    name: string;
    observer_slot: number;
    team: "CT" | "T";
    state: {
        health: number;
        armor: number;
        helmet: boolean;
        defusekit?: boolean;
        money: number;
        round_kills: number;
        flashed: number;
    };
    weapons: Record<string, GSIWeapon>;
    match_stats: { kills: number; deaths: number; assists: number };
    position?: string | GSIPosition | [number, number, number?] | number[];
    forward?: string | GSIPosition | [number, number, number?] | number[];
    activity?: string;
}

export interface GSIMap {
    name: string;
    phase: string;
    team_ct: GSITeam;
    team_t: GSITeam;
}

export interface GSITeam {
    score: number;
    name: string;
}