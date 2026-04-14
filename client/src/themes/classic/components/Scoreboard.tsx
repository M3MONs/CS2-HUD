import type { ThemeProps } from "../../registry";
import { motion } from "framer-motion";
import { PHASE_L } from "../constants";
import { useClassicPalette } from "../useClassicPalette";
import TeamPanel from "./TeamPanel";
import "./style.css";

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

    const sharedVars = {
        "--c-ff": C.ff,
        "--c-bg": C.bg,
        "--c-div": C.div,
        "--c-w": C.w,
        "--c-w90": C.w90,
        "--c-w40": C.w40,
        "--c-phase-clr": live ? C.hp.hi : C.w40,
        "--c-hp-hi": C.hp.hi,
    } as React.CSSProperties;

    return (
        <motion.div
            className="classic-scoreboard"
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ type: "spring", stiffness: 320, damping: 30 }}
            style={sharedVars}
        >
            <div className="classic-scoreboard__row">
                <TeamPanel
                    side="ct"
                    name={map.team_ct.name}
                    score={map.team_ct.score}
                    grad={C.ct.grad}
                    glow={C.ct.glow}
                />

                <div className="classic-scoreboard__center">
                    <span className="classic-scoreboard__round">
                        ROUND {round > 24 ? "OT" : `${round}/24`}
                    </span>
                    <span className="classic-scoreboard__timer">
                        {sec > 0 ? timer : "—"}
                    </span>
                    <span className="classic-scoreboard__phase">
                        {PHASE_L[phase] ?? (phase || map.phase)}
                    </span>
                    {live && (
                        <motion.div
                            className="classic-scoreboard__live-dot"
                            animate={{ opacity: [1, 0.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.1 }}
                        />
                    )}
                </div>

                <TeamPanel
                    side="t"
                    name={map.team_t.name}
                    score={map.team_t.score}
                    grad={C.t.grad}
                    glow={C.t.glow}
                />
            </div>
        </motion.div>
    );
};
