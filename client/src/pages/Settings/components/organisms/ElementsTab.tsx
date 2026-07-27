import { useHudConfigStore } from "@/stores/HudConfigStore";
import type { HudElementsVisibility } from "@/types/hudConfig";
import Toggle from "../atoms/Toggle";

const ELEMENT_LABELS: Record<keyof HudElementsVisibility, string> = {
    scoreboard: "Scoreboard",
    player_stats: "Player Stats",
    killfeed: "Kill Feed",
    minimap: "Minimap",
    bomb_timer: "Bomb Timer",
    round_info: "Round Info",
    team_economy: "Team Economy",
    phase_countdown: "Phase Countdown",
    player_inventory: "Player Inventory",
};

const ElementsTab = () => {
    const config = useHudConfigStore((s) => s.config);
    const toggleElement = useHudConfigStore((s) => s.toggleElement);

    if (!config) return null;

    return (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {(Object.keys(config.elements) as (keyof HudElementsVisibility)[]).map((key) => (
                <div
                    key={key}
                    className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 px-4 py-3 transition hover:bg-white/[0.07]"
                >
                    <span className="text-sm text-white/70">{ELEMENT_LABELS[key]}</span>
                    <Toggle checked={config.elements[key]} onChange={() => toggleElement(key)} />
                </div>
            ))}
        </div>
    );
};

export default ElementsTab;
