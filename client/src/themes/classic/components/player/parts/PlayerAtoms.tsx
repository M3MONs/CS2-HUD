import { motion } from "framer-motion";
import type { GSIPlayer } from "@/types/gsi";

export const PlayerAvatar = ({ avatar }: { avatar?: string }) =>
    avatar ? (
        <div className="classic-player__avatar-wrap">
            <img className="classic-player__avatar" src={avatar} alt="" draggable={false} />
        </div>
    ) : null;

export const HpBar = ({ health }: { health: number }) => (
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
