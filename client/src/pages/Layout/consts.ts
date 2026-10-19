import type { HudComponentId, ThemeLayout } from "@/types/hudConfig";

/** Which swappable HUD component a draggable layout slot renders (minimap has none). */
export const LAYOUT_KEY_COMPONENT: Partial<Record<keyof ThemeLayout, HudComponentId>> = {
    scoreboard: "scoreboard",
    bomb_timer: "bomb_timer",
    team_ct: "player_stats",
    team_t: "player_stats",
};
