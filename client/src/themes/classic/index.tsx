import type { FC } from "react";
import type { ThemeProps } from "../registry";
import { AnimatePresence, motion } from "framer-motion";
import { sorted } from "./helpers";
import { Scoreboard, PlayerCard, BombTimer, DefuseTimer, RadarMap } from "./components";
import Positioned from "./components/Positioned";
import type { GSIPlayer } from "@/types/gsi";
import "./components/style.css";

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
    const selfId = data.player?.steamid;
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
                    <Scoreboard map={data.map} pc={elements.phase_countdown ? data.phase_countdowns : undefined} />
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
                        <BombTimer key="bomb" bomb={data.bomb} />
                        <DefuseTimer key="defuse" bomb={data.bomb} />
                    </Positioned>
                )}
            </AnimatePresence>

            {showTeams && elements.team_economy && ctPlayers.length > 0 && (
                <Positioned
                    layoutKey="team_ct"
                    position={layout.team_ct}
                    className="classic-layout__players"
                    pinBottom
                    editable={editable}
                    onSelect={() => onSelectKey?.("team_ct")}
                    onMove={(pos) => onLayoutMove?.("team_ct", pos)}
                    style={{ zIndex: 10 }}
                >
                    <motion.div
                        className="classic-layout__players-inner"
                        initial={editable ? false : { y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
                    >
                        {ctPlayers.map((p) => (
                            <PlayerCard
                                key={p.steamid}
                                player={p}
                                observed={elements.player_stats === true && p.steamid === selfId}
                                side="ct"
                            />
                        ))}
                    </motion.div>
                </Positioned>
            )}

            {showTeams && elements.team_economy && tPlayers.length > 0 && (
                <Positioned
                    layoutKey="team_t"
                    position={layout.team_t}
                    className="classic-layout__players"
                    pinBottom
                    anchorRight
                    editable={editable}
                    onSelect={() => onSelectKey?.("team_t")}
                    onMove={(pos) => onLayoutMove?.("team_t", pos)}
                    style={{ zIndex: 10 }}
                >
                    <motion.div
                        className="classic-layout__players-inner"
                        initial={editable ? false : { y: 30, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
                    >
                        {tPlayers.map((p) => (
                            <PlayerCard
                                key={p.steamid}
                                player={p}
                                observed={elements.player_stats === true && p.steamid === selfId}
                                side="t"
                            />
                        ))}
                    </motion.div>
                </Positioned>
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
