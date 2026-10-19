import { useRef } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { motion } from "framer-motion";
import type { VariantProps } from "@/themes/variants/contracts";
import { Variant } from "@/themes/variants/Variant";
import { useClassicPalette } from "../useClassicPalette";
import { pickActiveWeapon, collectGrenades } from "../helpers";
import { playerVars } from "./playerVars";
import { resolveWeaponImage } from "../weaponImages";
import armorFull from "@/assets/images/icon_armor_full_default.svg";
import armorHalf from "@/assets/images/icon_armor_half_default.svg";
import armorHelmet from "@/assets/images/icon_armor_helmet_default.svg";
import armorHalfHelmet from "@/assets/images/icon_armor_half_helmet_default.svg";
import defuseKitImg from "@/assets/images/icon_defuse_default.svg";
import "./style.css";

export const PlayerAvatar = ({ avatar }: { avatar?: string }) =>
    avatar ? (
        <div className="classic-player__avatar-wrap">
            <img className="classic-player__avatar" src={avatar} alt="" draggable={false} />
        </div>
    ) : null;

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

const HpBar = ({ health }: { health: number }) => (
    <div className="classic-player__hp-bar">
        <motion.div
            className="classic-player__hp-fill"
            animate={{ width: `${health}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        />
    </div>
);

export const PlayerName = ({ name }: { name: string }) => <div className="classic-player__name">{name}</div>;

export const KdaRow = ({ match_stats }: { match_stats: GSIPlayer["match_stats"] }) =>
    match_stats ? (
        <div className="classic-player__kda">
            <span className="classic-player__kda-kills">{match_stats.kills}</span>
            <span className="classic-player__kda-div">/</span>
            <span>{match_stats.assists}</span>
            <span className="classic-player__kda-div">/</span>
            <span className="classic-player__kda-deaths">{match_stats.deaths}</span>
        </div>
    ) : null;

export const DeadOverlay = () => (
    <div className="classic-player__dead-overlay">
        <span className="classic-player__dead-text">DEAD</span>
    </div>
);

const armorIcon = (armor: number, helmet: boolean): string => {
    if (armor > 50) return helmet ? armorHelmet : armorFull;
    return helmet ? armorHalfHelmet : armorHalf;
};

const GrenadeSlot = ({ name, grenades, dead }: { name: string; grenades: Map<string, number>; dead: boolean }) => {
    const rawCount =
        name === "molotov"
            ? Math.min(1, (grenades.get("molotov") ?? 0) + (grenades.get("incgrenade") ?? 0))
            : (grenades.get(name) ?? 0);

    const count = name === "flashbang" ? rawCount : Math.min(1, rawCount);

    const lookupName =
        name === "molotov" && !grenades.get("molotov") && grenades.get("incgrenade") ? "incgrenade" : name;

    const src = resolveWeaponImage(`weapon_${lookupName}`);
    const filter =
        count === 0
            ? "brightness(0) invert(1) opacity(0.15)"
            : dead
              ? "brightness(0) invert(1) opacity(0.4)"
              : "brightness(0) invert(1)";

    return (
        <div className="classic-player__grenade-slot">
            {src && (
                <>
                    <img
                        className="classic-player__grenade-img"
                        src={src}
                        alt=""
                        draggable={false}
                        style={{ filter }}
                    />
                    {name === "flashbang" && count >= 2 && <span className="classic-player__grenade-count">x2</span>}
                </>
            )}
        </div>
    );
};

export const WeaponRow = ({ player, dead }: { player: GSIPlayer; dead: boolean }) => {
    const lastSrcRef = useRef<string | undefined>(undefined);
    const active = pickActiveWeapon(player);
    const freshSrc = active ? resolveWeaponImage(active.name) : undefined;
    if (freshSrc) lastSrcRef.current = freshSrc;
    const weaponSrc = freshSrc ?? lastSrcRef.current;
    const grenades = collectGrenades(player);

    // grenade SVGs are black by default — need invert;
    const isGrenade = active?.type.toLowerCase() === "grenade";
    const weaponFilter = dead
        ? isGrenade
            ? "brightness(0) invert(1) opacity(0.35)"
            : "grayscale(1) opacity(0.35)"
        : isGrenade
          ? "brightness(0) invert(1)"
          : "none";

    return (
        <div className="classic-player__weapon-row">
            <div className="classic-player__grenades-left">
                <GrenadeSlot name="smokegrenade" grenades={grenades} dead={dead} />
                <GrenadeSlot name="molotov" grenades={grenades} dead={dead} />
            </div>
            <div className="classic-player__weapon">
                {weaponSrc && (
                    <img
                        className="classic-player__weapon-img"
                        src={weaponSrc}
                        alt=""
                        draggable={false}
                        style={{ filter: weaponFilter, maxWidth: isGrenade ? "40%" : "100%" }}
                    />
                )}
            </div>
            <div className="classic-player__grenades-right">
                <GrenadeSlot name="hegrenade" grenades={grenades} dead={dead} />
                <GrenadeSlot name="flashbang" grenades={grenades} dead={dead} />
            </div>
        </div>
    );
};

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
