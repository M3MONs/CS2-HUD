import type { ThemeProps } from "../registry";
import { AnimatePresence, motion } from "framer-motion";
import { sorted } from "./helpers";
import { Scoreboard, PlayerCard, BombTimer } from "./components";
import type { GSIPlayer } from "@/types/gsi";

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

    return (
        <>
            {elements.scoreboard && data.map && (
                <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", zIndex: 10 }}>
                    <Scoreboard map={data.map} pc={elements.phase_countdown ? data.phase_countdowns : undefined} />
                </div>
            )}

            <AnimatePresence>
                {elements.bomb_timer && data.bomb && (
                    <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 20 }}>
                        <BombTimer bomb={data.bomb} />
                    </div>
                )}
            </AnimatePresence>

            {(elements.team_economy || elements.player_stats) && (
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
                    style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        zIndex: 10,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-end",
                        gap: 2,
                        padding: "0 16px",
                    }}
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
                        <div style={{ width: 150, flexShrink: 0 }} />
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
        </>
    );
};

export default BroadcastTheme;
