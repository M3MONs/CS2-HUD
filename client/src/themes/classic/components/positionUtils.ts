import { HUD_VIEWPORT } from "@/consts/hudViewport";
import type { ElementPosition, ThemeLayout } from "@/types/hudConfig";

/** How a slot's (x, y) point maps onto its box. */
export type SlotAnchors = {
    centerX?: boolean;
    pinBottom?: boolean;
    anchorRight?: boolean;
};

export type ElementSize = { width: number; height: number };

type Range = { min: number; max: number };

const round1 = (n: number) => Math.round(n * 10) / 10;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

/** Allowed % range for an axis given the element size (%) and where its anchor sits on the box (0 = start, 0.5 = center, 1 = end). */
const axisRange = (sizePct: number, anchor: number): Range => {
    const min = sizePct * anchor;
    const max = 100 - sizePct * (1 - anchor);
    if (min <= max) return { min, max };

    // Element larger than the viewport: pin to the midpoint, but never leave 0..100.
    const mid = clamp((min + max) / 2, 0, 100);
    return { min: mid, max: mid };
};

const xAnchor = ({ centerX, anchorRight }: SlotAnchors) => (centerX ? 0.5 : anchorRight ? 1 : 0);
const yAnchor = ({ pinBottom }: SlotAnchors) => (pinBottom ? 1 : 0);

/** Clamp a position (in % of the HUD viewport) so the element stays fully on the canvas. */
export const clampPos = (
    pos: ElementPosition,
    size: ElementSize,
    anchors: SlotAnchors,
): ElementPosition => {
    const xRange = axisRange((size.width / HUD_VIEWPORT.width) * 100, xAnchor(anchors));
    const yRange = axisRange((size.height / HUD_VIEWPORT.height) * 100, yAnchor(anchors));

    return {
        x: round1(clamp(pos.x, xRange.min, xRange.max)),
        y: round1(clamp(pos.y, yRange.min, yRange.max)),
    };
};

/** Anchor semantics per layout slot. */
export const SLOT_ANCHORS: Record<keyof ThemeLayout, SlotAnchors> = {
    scoreboard: { centerX: true },
    bomb_timer: { centerX: true },
    team_ct: { pinBottom: true },
    team_t: { pinBottom: true, anchorRight: true },
    minimap: {},
};
