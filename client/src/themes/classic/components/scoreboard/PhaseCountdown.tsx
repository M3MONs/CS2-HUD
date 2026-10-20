import { motion } from "framer-motion";
import type { VariantProps } from "@/themes/variants/contracts";
import { PHASE_L } from "../../constants";
import { useClassicPalette } from "../../useClassicPalette";
import "./scoreboard.css";

export const PhaseCountdown = ({ map, pc }: VariantProps["phase_countdown"]) => {
    const C = useClassicPalette();
    const sec = parseFloat(pc?.phase_ends_in ?? "0");
    const phase = pc?.phase ?? "";
    const mm = Math.floor(sec / 60);
    const ss = Math.floor(sec % 60);
    const timer = `${mm}:${ss.toString().padStart(2, "0")}`;
    const round = map.team_ct.score + map.team_t.score + 1;
    const live = phase === "live";

    return (
        <div
            className="classic-scoreboard__center"
            style={{ "--c-phase-clr": live ? C.hp.hi : C.w40 } as React.CSSProperties}
        >
            <span className="classic-scoreboard__round">ROUND {round > 24 ? "OT" : `${round}/24`}</span>
            <span className="classic-scoreboard__timer">{sec > 0 ? timer : "—"}</span>
            <span className="classic-scoreboard__phase">{PHASE_L[phase] ?? (phase || map.phase)}</span>
            {live && (
                <motion.div
                    className="classic-scoreboard__live-dot"
                    animate={{ opacity: [1, 0.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.1 }}
                />
            )}
        </div>
    );
};
