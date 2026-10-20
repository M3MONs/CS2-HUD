import { motion } from "framer-motion";
import { Variant } from "@/themes/variants/Variant";
import type { VariantProps } from "@/themes/variants/contracts";
import { useClassicPalette } from "../../useClassicPalette";
import { DeadOverlay, KdaRow, PlayerAvatar, PlayerName } from "./parts/PlayerAtoms";
import { HpRow } from "./parts/HpRow";
import { WeaponRow } from "./parts/WeaponRow";
import { playerVars } from "./playerVars";
import "./player.css";
import "./playerBar.css";

/**
 * `player_stats` variant "bars": one horizontal bar per player. The bar background
 * is the health meter, filling from the screen edge (CT left, T right, see `.classic-hbar--t`).
 */
export const PlayerBar = ({ player, observed, side }: VariantProps["player_stats"]) => {
    const C = useClassicPalette();
    const { state, name, match_stats } = player;
    const dead = state.health <= 0;
    const lowHp = !dead && state.health <= 25;
    const team = side === "ct" ? C.ct : C.t;

    const style = {
        ...playerVars(C, side, observed, state.health),
        "--c-team-glow": team.glow,
        "--c-grenade-size": observed ? "16px" : "14px",
        "--c-weapon-w": observed ? "50px" : "46px",
        "--c-weapon-h": observed ? "32px" : "28px",
        "--c-weapon-pad": "0",
    } as React.CSSProperties;

    return (
        <motion.div
            className={`classic-hbar classic-hbar--${side}${observed ? " classic-hbar--observed" : ""}`}
            layout
            animate={{ opacity: dead ? 0.38 : 1 }}
            transition={{ duration: 0.2 }}
            style={style}
        >
            <motion.div
                className="classic-hbar__fill"
                animate={{ width: `${dead ? 0 : state.health}%` }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <PlayerAvatar avatar={player.avatar} />
            <HpRow
                health={state.health}
                armor={state.armor}
                helmet={state.helmet}
                defusekit={state.defusekit}
                lowHp={lowHp}
                dead={dead}
            />
            <PlayerName name={name} />
            <KdaRow match_stats={match_stats} />
            <WeaponRow player={player} dead={dead} />
            <Variant id="team_economy" player={player} />
            {dead && <DeadOverlay />}
        </motion.div>
    );
};
