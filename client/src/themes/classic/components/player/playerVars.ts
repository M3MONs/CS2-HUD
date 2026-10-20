import type { CSSProperties } from "react";
import { hpC } from "../../helpers";
import type { ClassicPalette } from "../../types";

/** CSS variables shared by every player_stats variant (card, bar…); the `.classic-player__*` parts read them. */
export const playerVars = (
    C: ClassicPalette,
    side: "ct" | "t",
    observed: boolean,
    health: number,
): CSSProperties => {
    const dead = health <= 0;
    const colors = side === "ct" ? C.ct : C.t;
    const hp = hpC(health, C.hp);

    return {
        "--c-ff": C.ff,
        "--c-bg": C.bg,
        "--c-player-w": `${observed ? 168 : 150}px`,
        "--c-player-border-w": observed ? "3px" : "2px",
        "--c-player-border-clr": dead && !observed ? C.dead : colors.solid,
        "--c-player-shadow": observed
            ? `0 -4px 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
            : "0 1px 4px rgba(0,0,0,0.3)",
        "--c-hp-row-pad": observed ? "8px 6px 2px" : "7px 4px 2px",
        "--c-hp-num-size": observed ? "29px" : "26px",
        "--c-hp-num-clr": dead ? C.w20 : hp,
        "--c-armor-size": observed ? "10px" : "8px",
        "--c-armor-clr": C.armor,
        "--c-w08": C.w08,
        "--c-hp-fill-clr": dead ? "transparent" : hp,
        "--c-name-size": observed ? "13px" : "12px",
        "--c-name-weight": observed ? "700" : "600",
        "--c-name-clr": dead ? C.w20 : observed ? C.w : C.w70,
        "--c-kda-size": observed ? "12px" : "11px",
        "--c-w40": C.w40,
        "--c-w70": C.w70,
        "--c-w20": C.w20,
        "--c-dead": C.dead,
        "--c-money-size": observed ? "13px" : "12px",
        "--c-money": C.money,
        "--c-money-opacity": dead ? "0.35" : "0.75",
        "--c-avatar-filter": dead ? "grayscale(1) brightness(0.5)" : "none",
        "--c-weapon-w": observed ? "58px" : "52px",
        "--c-weapon-h": observed ? "36px" : "32px",
        "--c-weapon-pad": observed ? "4px 2px 2px" : "2px 2px 1px",
        "--c-grenade-size": observed ? "22px" : "18px",
        "--c-equip-size": observed ? "14px" : "12px",
    } as CSSProperties;
};
