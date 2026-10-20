import { BombTimers } from "../classic/components/bomb/BombTimers";
import { PhaseCountdown } from "../classic/components/scoreboard/PhaseCountdown";
import { PlayerBar } from "../classic/components/player/PlayerBar";
import { PlayerCard } from "../classic/components/player/PlayerCard";
import { Scoreboard } from "../classic/components/scoreboard/Scoreboard";
import { TeamEconomy } from "../classic/components/player/TeamEconomy";
import { DEFAULT_VARIANT, registerVariant } from "./registry";

/**
 * Variant registrations. To add a new look: create the component (matching
 * its contract in `contracts.ts`) and add one `registerVariant` line here.
 */
registerVariant("scoreboard", { id: DEFAULT_VARIANT, label: "Classic", component: Scoreboard });
registerVariant("player_stats", { id: DEFAULT_VARIANT, label: "Classic", component: PlayerCard });
registerVariant("player_stats", {
    id: "bars",
    label: "Horizontal bars",
    component: PlayerBar,
    containerClassName: "classic-layout__players-inner--column",
});
registerVariant("bomb_timer", { id: DEFAULT_VARIANT, label: "Classic", component: BombTimers });
registerVariant("team_economy", { id: DEFAULT_VARIANT, label: "Classic", component: TeamEconomy });
registerVariant("phase_countdown", { id: DEFAULT_VARIANT, label: "Classic", component: PhaseCountdown });
