import type { ElementPosition } from "@/types/hudConfig";

const round1 = (n: number) => Math.round(n * 10) / 10;

export const clampPos = (
    x: number,
    y: number,
    elW: number,
    elH: number,
    rootW: number,
    rootH: number,
    centerX: boolean,
    pinBottom: boolean,
    anchorRight: boolean,
): ElementPosition => {
    const wPct = (elW / rootW) * 100;
    const hPct = (elH / rootH) * 100;

    let minX = 0;
    let maxX = 100 - wPct;
    if (centerX) {
        minX = wPct / 2;
        maxX = 100 - wPct / 2;
    } else if (anchorRight) {
        minX = wPct;
        maxX = 100;
    }

    let minY = 0;
    let maxY = 100 - hPct;
    if (pinBottom) {
        minY = hPct;
        maxY = 100;
    }

    if (minX > maxX) {
        const mid = (minX + maxX) / 2;
        minX = maxX = mid;
    }
    if (minY > maxY) {
        const mid = (minY + maxY) / 2;
        minY = maxY = mid;
    }

    return {
        x: round1(Math.min(maxX, Math.max(minX, x))),
        y: round1(Math.min(maxY, Math.max(minY, y))),
    };
};

/** Anchor semantics per layout slot — used by AlignBar. */
export const SLOT_ANCHORS: Record<
    string,
    { centerX?: boolean; pinBottom?: boolean; anchorRight?: boolean }
> = {
    scoreboard: { centerX: true },
    bomb_timer: { centerX: true },
    team_ct: { pinBottom: true },
    team_t: { pinBottom: true, anchorRight: true },
    minimap: {},
};
