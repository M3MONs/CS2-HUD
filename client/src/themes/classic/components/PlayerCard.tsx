import { useRef } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { motion } from "framer-motion";
import { useClassicPalette } from "../useClassicPalette";
import { hpC, pickActiveWeapon, collectGrenades } from "../helpers";
import { resolveWeaponImage } from "../weaponImages";
import armorFull from "@/assets/images/icon_armor_full_default.svg";
import armorHalf from "@/assets/images/icon_armor_half_default.svg";
import armorHelmet from "@/assets/images/icon_armor_helmet_default.svg";
import armorHalfHelmet from "@/assets/images/icon_armor_half_helmet_default.svg";
import defuseKitImg from "@/assets/images/icon_defuse_default.svg";
import "./style.css";

const PlayerAvatar = ({ avatar }: { avatar?: string }) =>
    avatar ? (
        <div className="classic-player__avatar-wrap">
            <img className="classic-player__avatar" src={avatar} alt="" draggable={false} />
        </div>
    ) : null;

const HpRow = ({
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

const PlayerName = ({ name }: { name: string }) => <div className="classic-player__name">{name}</div>;

const KdaRow = ({ match_stats }: { match_stats: GSIPlayer["match_stats"] }) =>
    match_stats ? (
        <div className="classic-player__kda">
            <span className="classic-player__kda-kills">{match_stats.kills}</span>
            <span className="classic-player__kda-div">/</span>
            <span>{match_stats.assists}</span>
            <span className="classic-player__kda-div">/</span>
            <span className="classic-player__kda-deaths">{match_stats.deaths}</span>
        </div>
    ) : null;

const MoneyDisplay = ({ money }: { money: number }) => (
    <div className="classic-player__money">
        ${money >= 10000 ? `${(money / 1000).toFixed(0)}k` : money >= 1000 ? `${(money / 1000).toFixed(1)}k` : money}
    </div>
);

const DeadOverlay = () => (
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

const WeaponRow = ({ player, dead }: { player: GSIPlayer; dead: boolean }) => {
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

export const PlayerCard = ({ player, observed, side }: { player: GSIPlayer; observed: boolean; side: "ct" | "t" }) => {
    const C = useClassicPalette();
    const { state, name, match_stats } = player;
    const dead = state.health <= 0;
    const colors = side === "ct" ? C.ct : C.t;
    const hp = hpC(state.health, C.hp);
    const lowHp = !dead && state.health <= 25;

    const w = observed ? 168 : 150;

    const style = {
        "--c-ff": C.ff,
        "--c-bg": C.bg,
        "--c-player-w": `${w}px`,
        "--c-player-border-w": observed ? "3px" : "2px",
        "--c-player-border-clr": dead && !observed ? C.dead : colors.solid,
        "--c-player-shadow": observed
            ? `0 -4px 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
            : "0 1px 4px rgba(0,0,0,0.3)",
        "--c-hp-row-pad": observed ? "8px 6px 2px" : "7px 4px 2px",
        "--c-hp-num-size": observed ? "29px" : "26px",
        "--c-hp-num-clr": dead ? C.w20 : hp,
        "--c-armor-size": observed ? "10px" : "8px",
        "--c-armor-clr": C.armor,
        "--c-w08": C.w08,
        "--c-hp-fill-clr": dead ? "transparent" : hp,
        "--c-name-size": observed ? "13px" : "12px",
        "--c-name-weight": observed ? "700" : "600",
        "--c-name-clr": dead ? C.w20 : observed ? C.w : C.w70,
        "--c-kda-size": observed ? "12px" : "11px",
        "--c-w40": C.w40,
        "--c-w70": C.w70,
        "--c-w20": C.w20,
        "--c-dead": C.dead,
        "--c-money-size": observed ? "13px" : "12px",
        "--c-money": C.money,
        "--c-money-opacity": dead ? "0.35" : "0.75",
        "--c-avatar-filter": dead ? "grayscale(1) brightness(0.5)" : "none",
        "--c-weapon-w": observed ? "58px" : "52px",
        "--c-weapon-h": observed ? "36px" : "32px",
        "--c-weapon-pad": observed ? "4px 2px 2px" : "2px 2px 1px",
        "--c-grenade-size": observed ? "22px" : "18px",
        "--c-equip-size": observed ? "14px" : "12px",
    } as React.CSSProperties;

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
            <MoneyDisplay money={state.money} />
            <WeaponRow player={player} dead={dead} />
            {dead && <DeadOverlay />}
        </motion.div>
    );
};
