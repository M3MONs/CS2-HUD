import type { GSIPlayer } from "@/types/gsi";
import { motion } from "framer-motion";
import { useClassicPalette } from "../useClassicPalette";
import { hpC } from "../helpers";
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
    lowHp,
    dead,
}: {
    health: number;
    armor: number;
    helmet: boolean;
    lowHp: boolean;
    dead: boolean;
}) => (
    <div className="classic-player__hp-row">
        <motion.span
            className="classic-player__hp-num"
            animate={lowHp ? { opacity: [1, 0.3, 1] } : { opacity: 1 }}
            transition={lowHp ? { repeat: Infinity, duration: 0.55 } : {}}
        >
            {dead ? "✕" : health}
        </motion.span>
        {!dead && armor > 0 && (
            <span className="classic-player__armor">{helmet ? "⊕" : "○"}</span>
        )}
    </div>
);

const HpBar = ({ health }: { health: number }) => (
    <div className="classic-player__hp-bar">
        <motion.div
            className="classic-player__hp-fill"
            animate={{ width: `${health}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
        />
    </div>
);

const PlayerName = ({ name }: { name: string }) => (
    <div className="classic-player__name">{name}</div>
);

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
        $
        {money >= 10000
            ? `${(money / 1000).toFixed(0)}k`
            : money >= 1000
            ? `${(money / 1000).toFixed(1)}k`
            : money}
    </div>
);

const DeadOverlay = () => (
    <div className="classic-player__dead-overlay">
        <span className="classic-player__dead-text">DEAD</span>
    </div>
);

export const PlayerCard = ({
    player,
    observed,
    side,
}: {
    player: GSIPlayer;
    observed: boolean;
    side: "ct" | "t";
}) => {
    const C = useClassicPalette();
    const { state, name, match_stats } = player;
    const dead = state.health <= 0;
    const colors = side === "ct" ? C.ct : C.t;
    const hp = hpC(state.health, C.hp);
    const lowHp = !dead && state.health <= 25;

    const w = observed ? 160 : 100;

    const style = {
        "--c-ff": C.ff,
        "--c-bg": C.bg,
        "--c-player-w": `${w}px`,
        "--c-player-border-w": observed ? "3px" : "2px",
        "--c-player-border-clr": dead && !observed ? C.dead : colors.solid,
        "--c-player-shadow": observed
            ? `0 -4px 20px ${colors.glow}, inset 0 0 20px ${colors.glow}`
            : "0 1px 4px rgba(0,0,0,0.3)",
        "--c-hp-row-pad": observed ? "8px 6px 2px" : "5px 4px 1px",
        "--c-hp-num-size": observed ? "32px" : "22px",
        "--c-hp-num-clr": dead ? C.w20 : hp,
        "--c-armor-size": observed ? "10px" : "8px",
        "--c-armor-clr": C.armor,
        "--c-w08": C.w08,
        "--c-hp-fill-clr": dead ? "transparent" : hp,
        "--c-name-size": observed ? "12px" : "9px",
        "--c-name-weight": observed ? "700" : "600",
        "--c-name-clr": dead ? C.w20 : observed ? C.w : C.w70,
        "--c-kda-size": observed ? "10px" : "8px",
        "--c-w40": C.w40,
        "--c-w70": C.w70,
        "--c-w20": C.w20,
        "--c-dead": C.dead,
        "--c-money-size": observed ? "11px" : "9px",
        "--c-money": C.money,
        "--c-money-opacity": dead ? "0.35" : "0.75",
        "--c-avatar-filter": dead ? "grayscale(1) brightness(0.5)" : "none",
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
                lowHp={lowHp}
                dead={dead}
            />
            <HpBar health={state.health} />
            <PlayerName name={name} />
            <KdaRow match_stats={match_stats} />
            <MoneyDisplay money={state.money} />
            {dead && <DeadOverlay />}
        </motion.div>
    );
};
