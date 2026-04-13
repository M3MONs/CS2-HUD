import type { ThemeProps } from "../../registry";
import { motion } from "framer-motion";
import { PHASE_L } from "../constants";
import { useClassicPalette } from "../useClassicPalette";

export const Scoreboard = ({
    map,
    pc,
}: {
    map: NonNullable<ThemeProps["data"]["map"]>;
    pc?: ThemeProps["data"]["phase_countdowns"];
}) => {
    const C = useClassicPalette();
    const sec = parseFloat(pc?.phase_ends_in ?? "0");
    const phase = pc?.phase ?? "";
    const mm = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60);
    const timer = `${mm}:${ss.toString().padStart(2, "0")}`;
    const round = map.team_ct.score + map.team_t.score + 1;
    const live = phase === "live";

    return (
        <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={{ fontFamily: C.ff, userSelect: "none" }}
        >
            <div style={{ display: "flex", alignItems: "stretch" }}>
                {/* CT */}
                <div
                    style={{
                        background: C.ct.grad,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        minWidth: 400,
                        boxShadow: `0 4px 16px ${C.ct.glow}`,
                    }}
                >
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.55)",
                            letterSpacing: "0.12em",
                        }}
                    >
                        CT
                    </span>
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: C.w90,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 300,
                        }}
                    >
                        {map.team_ct.name || "CT"}
                    </span>
                    <span
                        style={{
                            fontSize: 32,
                            fontWeight: 800,
                            color: C.w,
                            lineHeight: 1,
                            marginLeft: "auto",
                            fontVariantNumeric: "tabular-nums",
                            textShadow: "0 2px 4px rgba(0,0,0,0.20)",
                        }}
                    >
                        {map.team_ct.score}
                    </span>
                </div>

                <div
                    style={{
                        background: C.bg,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "4px 20px",
                        minWidth: 88,
                        borderLeft: `1px solid ${C.div}`,
                        borderRight: `1px solid ${C.div}`,
                        position: "relative",
                    }}
                >
                    <span style={{ fontSize: 8, fontWeight: 700, color: C.w40, letterSpacing: "0.20em", textAlign: "center" }}>
                        ROUND {round > 24 ? "OT" : `${round}/24`}
                    </span>
                    <span
                        style={{
                            fontSize: 24,
                            fontWeight: 800,
                            color: C.w,
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                            marginTop: 1,
                        }}
                    >
                        {sec > 0 ? timer : "—"}
                    </span>
                    <span
                        style={{
                            fontSize: 8,
                            fontWeight: 700,
                            color: live ? C.hp.hi : C.w40,
                            letterSpacing: "0.15em",
                            marginTop: 1,
                        }}
                    >
                        {PHASE_L[phase] ?? (phase || map.phase)}
                    </span>
                    {live && (
                        <motion.div
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.1 }}
                            style={{
                                position: "absolute",
                                top: 4,
                                right: 6,
                                width: 4,
                                height: 4,
                                borderRadius: "50%",
                                background: C.hp.hi,
                                boxShadow: `0 0 5px ${C.hp.hi}`,
                            }}
                        />
                    )}
                </div>

                <div
                    style={{
                        background: C.t.grad,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "6px 16px",
                        minWidth: 400,
                        boxShadow: `0 4px 16px ${C.t.glow}`,
                    }}
                >
                    <span
                        style={{
                            fontSize: 32,
                            fontWeight: 800,
                            color: C.w,
                            lineHeight: 1,
                            fontVariantNumeric: "tabular-nums",
                            textShadow: "0 2px 4px rgba(0,0,0,0.20)",
                        }}
                    >
                        {map.team_t.score}
                    </span>
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 600,
                            color: C.w90,
                            textTransform: "uppercase",
                            letterSpacing: "0.04em",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            textAlign: "right",
                            maxWidth: 300,
                            width: "100%",
                        }}
                    >
                        {map.team_t.name || "T"}
                    </span>
                    <span
                        style={{
                            fontSize: 16,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.55)",
                            letterSpacing: "0.12em",
                            marginLeft: "auto",
                        }}
                    >
                        T
                    </span>
                </div>
            </div>
        </motion.div>
    );
};
