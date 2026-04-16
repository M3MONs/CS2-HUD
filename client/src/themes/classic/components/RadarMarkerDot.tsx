import type { CSSProperties } from "react";
import type { RadarMarkerDotProps } from "../types";

export const RadarMarkerDot = ({
    steamid,
    name,
    team,
    slot,
    flashed,
    shooting,
    bombCarrier,
    px,
    py,
}: RadarMarkerDotProps) => {
    const classes = [
        "classic-radar__marker",
        `classic-radar__marker--${team.toLowerCase()}`,
        flashed ? "classic-radar__marker--flashed" : "",
        shooting ? "classic-radar__marker--shooting" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            key={steamid}
            className={classes}
            style={{ transform: `translate(${px}px, ${py}px)` } as CSSProperties}
            title={name}
        >
            <span className="classic-radar__slot">{slot >= 0 ? slot + 1 : "?"}</span>
            {bombCarrier && <span className="classic-radar__bomb-dot" />}
        </div>
    );
};
