import type { ThemeProps } from "@/themes/registry";
import { motion } from "framer-motion";
import { useClassicPalette } from "@/themes/classic/useClassicPalette";

export const BombTimer = ({ bomb }: { bomb: NonNullable<ThemeProps["data"]["bomb"]> }) => {
    const C = useClassicPalette();
    const planted = bomb.state === "planted";
    const defused = bomb.state === "defused";
    const exploded = bomb.state === "exploded";
    if (!planted && !defused && !exploded) return null;

    const sec = parseFloat(bomb.countdown ?? "0");
    const urgent = planted && sec <= 10;
    const clr = defused ? C.hp.hi : exploded ? C.hp.lo : C.t.solid;

    return (
        <motion.div
            initial={{ scale: 0.88, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.88, opacity: 0 }}
            style={{
                fontFamily: C.ff,
                background: C.bg,
                border: `1px solid ${urgent ? C.hp.lo : C.div}`,
                borderRadius: 8,
                padding: "16px 32px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 6,
                boxShadow: urgent
                    ? `0 0 36px rgba(212,64,64,0.40), 0 8px 24px rgba(0,0,0,0.5)`
                    : "0 8px 24px rgba(0,0,0,0.5)",
                userSelect: "none",
            }}
        >
            <span style={{ fontSize: 9, fontWeight: 700, color: C.w40, letterSpacing: "0.25em" }}>
                {defused ? "DEFUSED" : exploded ? "EXPLODED" : "BOMB PLANTED"}
            </span>
            <motion.span
                key={Math.floor(sec)}
                animate={urgent ? { scale: [1, 1.05, 1] } : { scale: 1 }}
                transition={urgent ? { repeat: Infinity, duration: 0.45 } : { duration: 0.1 }}
                style={{
                    fontSize: 42,
                    fontWeight: 800,
                    color: clr,
                    lineHeight: 1,
                    fontVariantNumeric: "tabular-nums",
                    textShadow: planted ? `0 0 18px ${clr}` : "none",
                }}
            >
                {defused ? "SAFE" : exploded ? "BOOM" : sec.toFixed(1)}
            </motion.span>
            {planted && (
                <div style={{ width: 100, height: 3, borderRadius: 2, background: C.w08, overflow: "hidden" }}>
                    <motion.div
                        style={{ height: "100%", borderRadius: 2, background: clr }}
                        animate={{ width: `${Math.min((sec / 40) * 100, 100)}%` }}
                        transition={{ duration: 0.1, ease: "linear" }}
                    />
                </div>
            )}
        </motion.div>
    );
};
