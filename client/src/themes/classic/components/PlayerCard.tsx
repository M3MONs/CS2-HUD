import type { GSIPlayer } from "@/types/gsi";
import { motion } from "framer-motion";
import { useClassicPalette } from "../useClassicPalette";
import { hpC } from "../helpers";

export const PlayerCard = ({
    player,
    observed,
    side,
}: {
    player: GSIPlayer;
    observed: boolean;
    side: "ct" | "t";
}) => {
    const C = useClassicPalette();
    const { state, name, match_stats } = player;
    const dead = state.health <= 0;
    const colors = side === "ct" ? C.ct : C.t;
    const hp = hpC(state.health, C.hp);
    const lowHp = !dead && state.health <= 25;

    /* Observed card is wider & taller */
    const w = observed ? 160 : 100;

    return (
        <motion.div
            layout
            animate={{ opacity: dead ? 0.38 : 1 }}
            transition={{ duration: 0.2 }}
            style={{
                fontFamily: C.ff,
                width: w,
                position: "relative",
                overflow: "hidden",
                background: C.bg,
                borderTop: observed
                    ? `3px solid ${colors.solid}`
                    : `2px solid ${dead ? C.dead : colors.solid}`,
                boxShadow: observed
                    ? `0 -4px 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
                    : "0 1px 4px rgba(0,0,0,0.3)",
                userSelect: "none",
                flexShrink: 0,
            }}
        >
            {/* ── HP row ── */}
            <div
                style={{
                    display: "flex",
                    alignItems: "baseline",
                    justifyContent: "center",
                    gap: 3,
                    padding: observed ? "8px 6px 2px" : "5px 4px 1px",
                }}
            >
                <motion.span
                    animate={lowHp ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                    transition={lowHp ? { repeat: Infinity, duration: 0.55 } : {}}
                    style={{
                        fontSize: observed ? 32 : 22,
                        fontWeight: 800,
                        color: dead ? C.w20 : hp,
                        lineHeight: 1,
                        fontVariantNumeric: "tabular-nums",
                    }}
                >
                    {dead ? "✕" : state.health}
                </motion.span>
                {!dead && state.armor > 0 && (
                    <span style={{ fontSize: observed ? 10 : 8, fontWeight: 700, color: C.armor }}>
                        {state.helmet ? "⊕" : "○"}
                    </span>
                )}
            </div>

            {/* HP bar */}
            <div style={{ height: 2, margin: "0 4px", borderRadius: 1, background: C.w08, overflow: "hidden" }}>
                <motion.div
                    animate={{ width: `${state.health}%` }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{ height: "100%", borderRadius: 1, background: dead ? "transparent" : hp }}
                />
            </div>

            {/* Name */}
            <div
                style={{
                    padding: "3px 4px 1px",
                    textAlign: "center",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontSize: observed ? 12 : 9,
                    fontWeight: observed ? 700 : 600,
                    color: dead ? C.w20 : observed ? C.w : C.w70,
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                }}
            >
                {name}
            </div>

            {/* KDA */}
            {match_stats && (
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: 2,
                        fontSize: observed ? 10 : 8,
                        fontWeight: 600,
                        fontVariantNumeric: "tabular-nums",
                        padding: "0 4px",
                        color: C.w40,
                    }}
                >
                    <span style={{ color: C.w70 }}>{match_stats.kills}</span>
                    <span style={{ color: C.w20 }}>/</span>
                    <span>{match_stats.assists}</span>
                    <span style={{ color: C.w20 }}>/</span>
                    <span style={{ color: C.dead }}>{match_stats.deaths}</span>
                </div>
            )}

            {/* Money */}
            <div
                style={{
                    padding: "2px 4px 4px",
                    textAlign: "center",
                    fontSize: observed ? 11 : 9,
                    fontWeight: 700,
                    color: C.money,
                    fontVariantNumeric: "tabular-nums",
                    opacity: dead ? 0.35 : 0.75,
                }}
            >
                ${state.money >= 10000 ? `${(state.money / 1000).toFixed(0)}k` : state.money >= 1000 ? `${(state.money / 1000).toFixed(1)}k` : state.money}
            </div>

            {/* Dead overlay */}
            {dead && (
                <div
                    style={{
                        position: "absolute",
                        inset: 0,
                        background: "rgba(0,0,0,0.55)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <span style={{ fontSize: 9, fontWeight: 800, color: C.dead, letterSpacing: "0.2em" }}>DEAD</span>
                </div>
            )}
        </motion.div>
    );
};
