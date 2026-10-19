import { motion } from "framer-motion";
import type { GSIPlayer } from "@/types/gsi";
import type { ElementPosition } from "@/types/hudConfig";
import { Variant } from "@/themes/variants/Variant";
import Positioned from "./Positioned";
import { SLOT_ANCHORS } from "./positionUtils";

type TeamSlotProps = {
    side: "ct" | "t";
    players: GSIPlayer[];
    position: ElementPosition;
    observedId?: string;
    editable: boolean;
    onSelect?: () => void;
    onMove?: (pos: ElementPosition) => void;
};

/** One team's row of player cards, placed in its `team_ct` / `team_t` layout slot. */
const TeamSlot = ({ side, players, position, observedId, editable, onSelect, onMove }: TeamSlotProps) => {
    const layoutKey = side === "ct" ? "team_ct" : "team_t";

    return (
        <Positioned
            layoutKey={layoutKey}
            position={position}
            className="classic-layout__players"
            {...SLOT_ANCHORS[layoutKey]}
            editable={editable}
            onSelect={onSelect}
            onMove={onMove}
            style={{ zIndex: 10 }}
        >
            <motion.div
                className="classic-layout__players-inner"
                initial={editable ? false : { y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 280, damping: 28, delay: 0.08 }}
            >
                {players.map((p) => (
                    <Variant
                        id="player_stats"
                        key={p.steamid}
                        player={p}
                        observed={observedId !== undefined && p.steamid === observedId}
                        side={side}
                    />
                ))}
            </motion.div>
        </Positioned>
    );
};

export default TeamSlot;
