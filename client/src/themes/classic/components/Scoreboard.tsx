import { motion } from "framer-motion";
import type { VariantProps } from "@/themes/variants/contracts";
import { Variant } from "@/themes/variants/Variant";
import { useClassicPalette } from "../useClassicPalette";
import TeamPanel from "./TeamPanel";
import "./style.css";

export const Scoreboard = ({ map, pc }: VariantProps["scoreboard"]) => {
    const C = useClassicPalette();

    const sharedVars = {
        "--c-ff": C.ff,
        "--c-bg": C.bg,
        "--c-div": C.div,
        "--c-w": C.w,
        "--c-w90": C.w90,
        "--c-w40": C.w40,
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

                <Variant id="phase_countdown" map={map} pc={pc} />

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
