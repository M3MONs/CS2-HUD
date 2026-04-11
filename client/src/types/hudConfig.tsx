export interface HudElementsVisibility {
    scoreboard: boolean;
    player_stats: boolean;
    killfeed: boolean;
    minimap: boolean;
    bomb_timer: boolean;
    round_info: boolean;
    team_economy: boolean;
    phase_countdown: boolean;
    player_inventory: boolean;
}

export interface ThemeColors {
    ct_primary: string;
    t_primary: string;
    background: string;
    text: string;
    accent: string;
    health_bar: string;
    armor_bar: string;
}

export interface HudTheme {
    id: string;
    name: string;
    colors: ThemeColors;
    font: string;
    border_radius: string;
    opacity: number;
}

export interface HudConfig {
    elements: HudElementsVisibility;
    active_theme_id: string;
    themes: HudTheme[];
}
