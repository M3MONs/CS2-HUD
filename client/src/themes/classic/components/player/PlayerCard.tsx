import { motion } from "framer-motion";
import type { VariantProps } from "@/themes/variants/contracts";
import { Variant } from "@/themes/variants/Variant";
import { useClassicPalette } from "../../useClassicPalette";
import { playerVars } from "./playerVars";
import { DeadOverlay, HpBar, KdaRow, PlayerAvatar, PlayerName } from "./parts/PlayerAtoms";
import { HpRow } from "./parts/HpRow";
import { WeaponRow } from "./parts/WeaponRow";
import "./player.css";

export const PlayerCard = ({ player, observed, side }: VariantProps["player_stats"]) => {
    const C = useClassicPalette();
    const { state, name, match_stats } = player;
    const dead = state.health <= 0;
    const lowHp = !dead && state.health <= 25;
    const style = playerVars(C, side, observed, state.health);

    return (
        <motion.div
            className="classic-player"
            layout
            animate={{ opacity: dead ? 0.38 : 1 }}
            transition={{ duration: 0.2 }}
            style={style}
        >
            <PlayerAvatar avatar={player.avatar} />
            <HpRow
                health={state.health}
                armor={state.armor}
                helmet={state.helmet}
                defusekit={state.defusekit}
                lowHp={lowHp}
                dead={dead}
            />
            <HpBar health={state.health} />
            <PlayerName name={name} />
            <KdaRow match_stats={match_stats} />
            <Variant id="team_economy" player={player} />
            <WeaponRow player={player} dead={dead} />
            {dead && <DeadOverlay />}
        </motion.div>
    );
};
