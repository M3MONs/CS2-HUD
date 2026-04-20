import { memo } from "react";
import type { RadarMarkerDotProps } from "../types";

export const RadarMarkerDot = memo(function RadarMarkerDot({
    steamid,
    name,
    team,
    slot,
    flashed,
    bombCarrier,
}: RadarMarkerDotProps) {
    const classes = [
        "classic-radar__marker",
        `classic-radar__marker--${team.toLowerCase()}`,
        flashed ? "classic-radar__marker--flashed" : "",
    ]
        .filter(Boolean)
        .join(" ");

    return (
        <div
            data-steamid={steamid}
            className={classes}
            title={name}
        >
            <span className="classic-radar__slot">{slot >= 0 ? slot + 1 : "?"}</span>
            {bombCarrier && <span className="classic-radar__bomb-dot" />}
        </div>
    );
});
