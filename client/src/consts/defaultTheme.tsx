import type { HudTheme, ThemeLayout } from "@/types/hudConfig";

export const DEFAULT_THEME_LAYOUT: ThemeLayout = {
    scoreboard: { x: 50, y: 0 },
    bomb_timer: { x: 50, y: 7 },
    team_ct: { x: 0, y: 100 },
    team_t: { x: 100, y: 100 },
    minimap: { x: 1, y: 2 },
};

// Default theme to ensure the HUD has a consistent look even if the API fails or returns incomplete data
export const defaultTheme: HudTheme = {
    id: "default",
    name: "Classic",
    colors: {
        ct_primary: "#5B9BD5",
        t_primary: "#E6C04E",
        background: "rgba(0,0,0,0.75)",
        text: "#FFFFFF",
        accent: "#FF6B00",
        health_bar: "#4ADE80",
        armor_bar: "#60A5FA",
    },
    font: "Inter",
    border_radius: "4px",
    opacity: 0.9,
    layout: DEFAULT_THEME_LAYOUT,
};
