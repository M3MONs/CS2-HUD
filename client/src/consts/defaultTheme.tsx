import type { HudTheme } from "@/types/hudConfig";

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
};