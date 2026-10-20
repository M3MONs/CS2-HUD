import type { GSIPayload, GSIPlayer } from "@/types/gsi";
import type { BombData } from "@/themes/classic/types";

type MapData = NonNullable<GSIPayload["map"]>;
type PhaseCountdown = GSIPayload["phase_countdowns"];

/**
 * Props contract per swappable HUD component.
 * Every variant of a component must accept exactly these props.
 */
export interface VariantProps {
    scoreboard: { map: MapData; pc?: PhaseCountdown };
    player_stats: { player: GSIPlayer; observed: boolean; side: "ct" | "t" };
    bomb_timer: { bomb: BombData };
    team_economy: { player: GSIPlayer };
    phase_countdown: { map: MapData; pc?: PhaseCountdown };
}
