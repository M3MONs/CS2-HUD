import { useRef } from "react";
import { motion } from "framer-motion";
import { useClassicPalette } from "@/themes/classic/useClassicPalette";
import type { BombData } from "@/themes/classic/types";
import "./style.css";

export const DefuseTimer = ({ bomb }: { bomb: BombData }) => {
    const C = useClassicPalette();
    const defusing = bomb.state === "defusing";
    const defused = bomb.state === "defused";
    if (!defusing && !defused) return null;

    const sec = parseFloat(bomb.countdown ?? "0");

    const peakRef = useRef(0);
    if (defusing && sec > peakRef.current) peakRef.current = sec;
    if (!defusing) peakRef.current = 0;

    const totalTime = peakRef.current > 5.5 ? 10 : 5;
    const progress = Math.min(sec / totalTime, 1);
    const clr = defused ? C.hp.hi : C.ct.solid;

    return (
        <motion.div
            className="classic-bomb"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            style={{
                "--c-ff": C.ff,
                "--c-bg": C.bg,
                "--c-bomb-border": C.ct.solid,
                "--c-bomb-shadow": `0 0 24px ${C.ct.glow}, 0 8px 24px rgba(0,0,0,0.5)`,
                "--c-w40": C.w40,
                "--c-timer-clr": clr,
                "--c-timer-shadow": `0 0 18px ${clr}`,
                "--c-w08": C.w08,
            } as React.CSSProperties}
        >
            <span className="classic-bomb__label">
                {defused ? "DEFUSED" : "DEFUSING"}
            </span>
            <motion.span
                className="classic-bomb__timer"
                key={Math.floor(sec)}
                animate={{ scale: [1, 1.04, 1] }}
                transition={defusing ? { repeat: Infinity, duration: 0.5 } : { duration: 0.1 }}
            >
                {defused ? "SAFE" : sec.toFixed(1)}
            </motion.span>
            {defusing && (
                <div className="classic-bomb__progress">
                    <motion.div
                        className="classic-bomb__progress-fill"
                        animate={{ width: `${progress * 100}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
            )}
        </motion.div>
    );
};
