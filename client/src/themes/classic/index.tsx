import type { ThemeProps } from "../registry";
import { AnimatePresence, motion } from "framer-motion";
import { sorted } from "./helpers";
import { Scoreboard, PlayerCard, BombTimer, RadarMap } from "./components";
import type { GSIPlayer } from "@/types/gsi";
import "./components/style.css";

const BroadcastTheme: React.FC<ThemeProps> = ({ data, elements }) => {
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

    return (
        <>
            <div className="classic-layout__top-center">
                {elements.scoreboard && data.map && (
                    <Scoreboard map={data.map} pc={elements.phase_countdown ? data.phase_countdowns : undefined} />
                )}
                <AnimatePresence>
                    {elements.bomb_timer && data.bomb && (
                        <BombTimer bomb={data.bomb} />
                    )}
                </AnimatePresence>
            </div>

            {(elements.team_economy || elements.player_stats) && (
                <motion.div
                    className="classic-layout__players"
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
                >
                    {elements.team_economy &&
                        ctPlayers.map((p) => (
                            <PlayerCard
                                key={p.steamid}
                                player={p}
                                observed={elements.player_stats === true && p.steamid === selfId}
                                side="ct"
                            />
                        ))}

                    {elements.team_economy && ctPlayers.length > 0 && tPlayers.length > 0 && (
                        <div className="classic-layout__spacer" />
                    )}

                    {elements.team_economy &&
                        tPlayers.map((p) => (
                            <PlayerCard
                                key={p.steamid}
                                player={p}
                                observed={elements.player_stats === true && p.steamid === selfId}
                                side="t"
                            />
                        ))}
                </motion.div>
            )}

            {elements.minimap && (
                <motion.div
                    className="classic-layout__radar"
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                >
                    <RadarMap
                        mapName={data.map?.name}
                        players={radarPlayers}
                        bombPosition={data.bomb?.position}
                    />
                </motion.div>
            )}
        </>
    );
};

export default BroadcastTheme;
