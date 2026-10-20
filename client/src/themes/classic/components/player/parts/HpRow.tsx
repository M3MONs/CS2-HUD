import { motion } from "framer-motion";
import armorFull from "@/assets/images/icon_armor_full_default.svg";
import armorHalf from "@/assets/images/icon_armor_half_default.svg";
import armorHelmet from "@/assets/images/icon_armor_helmet_default.svg";
import armorHalfHelmet from "@/assets/images/icon_armor_half_helmet_default.svg";
import defuseKitImg from "@/assets/images/icon_defuse_default.svg";

const armorIcon = (armor: number, helmet: boolean): string => {
    if (armor > 50) return helmet ? armorHelmet : armorFull;
    return helmet ? armorHalfHelmet : armorHalf;
};

export const HpRow = ({
    health,
    armor,
    helmet,
    defusekit,
    lowHp,
    dead,
}: {
    health: number;
    armor: number;
    helmet: boolean;
    defusekit?: boolean;
    lowHp: boolean;
    dead: boolean;
}) => {
    const equipFilter = dead ? "brightness(0) invert(1) opacity(0.35)" : "brightness(0) invert(1)";
    return (
        <div className="classic-player__hp-row">
            <motion.span
                className="classic-player__hp-num"
                animate={lowHp ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
                transition={lowHp ? { repeat: Infinity, duration: 0.55 } : {}}
            >
                {dead ? "✕" : health}
            </motion.span>
            <div className="classic-player__hp-equip">
                {armor > 0 && (
                    <img
                        className="classic-player__equip-img"
                        src={armorIcon(armor, helmet)}
                        alt=""
                        draggable={false}
                        style={{ filter: equipFilter }}
                    />
                )}
                {defusekit && (
                    <img
                        className="classic-player__equip-img"
                        src={defuseKitImg}
                        alt=""
                        draggable={false}
                        style={{ filter: equipFilter }}
                    />
                )}
            </div>
        </div>
    );
};
