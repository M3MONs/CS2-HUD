export interface GSIPayload {
    provider: any;
    map: GSIMap;
    round?: { phase: string; bomb?: string };
    player: GSIPlayer;
    allplayers?: Record<string, GSIPlayer>;
    bomb?: { state: string; position: string; countdown: string };
    phase_countdowns?: { phase: string; phase_ends_in: string };
}

export interface GSIPlayer {
    steamid: string;
    name: string;
    observer_slot: number;
    team: "CT" | "T";
    state: {
        health: number;
        armor: number;
        helmet: boolean;
        money: number;
        round_kills: number;
        flashed: number;
    };
    weapons: Record<string, any>;
    match_stats: { kills: number; deaths: number; assists: number };
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