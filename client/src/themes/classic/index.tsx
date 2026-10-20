import type { FC } from "react";
import type { ThemeProps } from "../registry";
import { AnimatePresence, motion } from "framer-motion";
import { sorted } from "./helpers";
import { RadarMap } from "./components/radar/RadarMap";
import { Variant } from "@/themes/variants/Variant";
import "@/themes/variants/register";
import Positioned from "./components/layout/Positioned";
import TeamSlot from "./components/layout/TeamSlot";
import type { GSIPlayer } from "@/types/gsi";

const BroadcastTheme: FC<ThemeProps> = ({
    data,
    elements,
    layout,
    editable = false,
    onSelectKey,
    onLayoutMove,
}) => {
    const all = data.allplayers ? Object.values(data.allplayers) : [];
    const normalizeTeam = (team: string | undefined) =>
        team?.toUpperCase() === "CT" || team?.toUpperCase() === "T";

    const coachLikeScore = (p: GSIPlayer & { activity?: string }) => {
        let score = 0;
        if (p.activity && p.activity !== "playing") score += 4;
        if (/coach/i.test(p.name || "")) score += 3;
        if (!p.match_stats) score += 2;
        if (Object.keys(p.weapons || {}).length === 0) score += 1;
        return score;
    };

    const isPlayablePlayer = (p: GSIPlayer & { activity?: string }) => {
        const slot = p.observer_slot ?? -1;
        return normalizeTeam(p.team) && slot >= 0 && slot <= 15;
    };

    const pickTeamPlayers = (team: "CT" | "T") =>
        sorted(all.filter((p) => isPlayablePlayer(p) && p.team === team))
            .sort((a, b) => coachLikeScore(a) - coachLikeScore(b))
            .slice(0, 5);

    const ctPlayers = pickTeamPlayers("CT");
    const tPlayers = pickTeamPlayers("T");
    const observedId = elements.player_stats ? data.player?.steamid : undefined;
    const radarPlayers = [...ctPlayers, ...tPlayers];
    const showTeams = elements.team_economy || elements.player_stats;

    return (
        <>
            {elements.scoreboard && data.map && (
                <Positioned
                    layoutKey="scoreboard"
                    position={layout.scoreboard}
                    className="classic-layout__scoreboard"
                    centerX
                    editable={editable}
                    onSelect={() => onSelectKey?.("scoreboard")}
                    onMove={(pos) => onLayoutMove?.("scoreboard", pos)}
                    style={{ zIndex: 20 }}
                >
                    <Variant
                        id="scoreboard"
                        map={data.map}
                        pc={elements.phase_countdown ? data.phase_countdowns : undefined}
                    />
                </Positioned>
            )}

            <AnimatePresence>
                {elements.bomb_timer && data.bomb && (
                    <Positioned
                        key="bomb-slot"
                        layoutKey="bomb_timer"
                        position={layout.bomb_timer}
                        className="classic-layout__bomb"
                        centerX
                        editable={editable}
                        onSelect={() => onSelectKey?.("bomb_timer")}
                        onMove={(pos) => onLayoutMove?.("bomb_timer", pos)}
                        style={{ zIndex: 20 }}
                    >
                        <Variant id="bomb_timer" bomb={data.bomb} />
                    </Positioned>
                )}
            </AnimatePresence>

            {showTeams && ctPlayers.length > 0 && (
                <TeamSlot
                    side="ct"
                    players={ctPlayers}
                    position={layout.team_ct}
                    observedId={observedId}
                    editable={editable}
                    onSelect={() => onSelectKey?.("team_ct")}
                    onMove={(pos) => onLayoutMove?.("team_ct", pos)}
                />
            )}

            {showTeams && tPlayers.length > 0 && (
                <TeamSlot
                    side="t"
                    players={tPlayers}
                    position={layout.team_t}
                    observedId={observedId}
                    editable={editable}
                    onSelect={() => onSelectKey?.("team_t")}
                    onMove={(pos) => onLayoutMove?.("team_t", pos)}
                />
            )}

            {elements.minimap && (
                <Positioned
                    layoutKey="minimap"
                    position={layout.minimap}
                    className="classic-layout__radar"
                    editable={editable}
                    onSelect={() => onSelectKey?.("minimap")}
                    onMove={(pos) => onLayoutMove?.("minimap", pos)}
                    style={{ zIndex: 15 }}
                >
                    <motion.div
                        initial={editable ? false : { x: -20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.25, ease: "easeOut" }}
                    >
                        <RadarMap
                            mapName={data.map?.name}
                            players={radarPlayers}
                            bombPosition={data.bomb?.position}
                        />
                    </motion.div>
                </Positioned>
            )}
        </>
    );
};

export default BroadcastTheme;
