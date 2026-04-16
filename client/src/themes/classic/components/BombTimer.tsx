import type { ThemeProps } from "@/themes/registry";
import { motion } from "framer-motion";
import { useClassicPalette } from "@/themes/classic/useClassicPalette";
import "./style.css";

export const BombTimer = ({ bomb }: { bomb: NonNullable<ThemeProps["data"]["bomb"]> }) => {
    const C = useClassicPalette();
    const planted = bomb.state === "planted";
    const exploded = bomb.state === "exploded";
    if (!planted && !exploded) return null;
    const defused = false;

    const sec = parseFloat(bomb.countdown ?? "0");
    const urgent = planted && sec <= 10;
    const clr = defused ? C.hp.hi : exploded ? C.hp.lo : C.t.solid;

    return (
        <motion.div
            className="classic-bomb"
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            style={{
                "--c-ff": C.ff,
                "--c-bg": C.bg,
                "--c-bomb-border": urgent ? C.hp.lo : C.div,
                "--c-bomb-shadow": urgent
                    ? `0 0 36px rgba(212,64,64,0.40), 0 8px 24px rgba(0,0,0,0.5)`
                    : "0 8px 24px rgba(0,0,0,0.5)",
                "--c-w40": C.w40,
                "--c-timer-clr": clr,
                "--c-timer-shadow": planted ? `0 0 18px ${clr}` : "none",
                "--c-w08": C.w08,
            } as React.CSSProperties}
        >
            <span className="classic-bomb__label">
                {defused ? "DEFUSED" : exploded ? "EXPLODED" : "BOMB PLANTED"}
            </span>
            <motion.span
                className="classic-bomb__timer"
                key={Math.floor(sec)}
                animate={urgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={urgent ? { repeat: Infinity, duration: 0.45 } : { duration: 0.1 }}
            >
                {defused ? "SAFE" : exploded ? "BOOM" : sec.toFixed(1)}
            </motion.span>
            {planted && (
                <div className="classic-bomb__progress">
                    <motion.div
                        className="classic-bomb__progress-fill"
                        animate={{ width: `${Math.min((sec / 40) * 100, 100)}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
            )}
        </motion.div>
    );
};
