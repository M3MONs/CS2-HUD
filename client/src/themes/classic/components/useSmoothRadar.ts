import { useEffect, useRef } from "react";
import { worldToRadar } from "../helpers";
import { LERP, LERP_BOUNDS, MOVE_THRESHOLD, EXTRAP_MAX_MS, EXTRAP_MIN_DT } from "../constants";
import type { SmoothPos, SmoothBounds, SmoothRadarParams } from "../types";

const SHOOTING_CLASS = "classic-radar__marker--shooting";

type VelocityEntry = {
    /** Last raw target position (radar %). */
    x: number;
    y: number;
    /** Velocity in radar-%/ms */
    vx: number;
    vy: number;
    /** performance.now() when the target was set. */
    stamp: number;
};

/**
 * Provide smooth animation for radar markers using velocity-based extrapolation (dead reckoning).
 *
 * Problem: GSI delivers positions at ~10 Hz (every 100ms). Simple LERP toward
 * the last known position always lags behind and creates visible "jumps" each time
 * a new target arrives.
 *
 * Solution: When a new position arrives, we compute per-marker velocity from the
 * previous target. In the rAF loop, we extrapolate the target forward by
 * velocity * timeSinceLastUpdate (capped at EXTRAP_MAX_MS) so the marker
 * predicts where the player is heading, then LERP toward that predicted point.
 */
export function useSmoothRadar({ mapName, markers, bombRadarPos, liveBounds, shotUntilRef }: SmoothRadarParams) {
    const velocityRef = useRef<Map<string, VelocityEntry>>(new Map());
    const smoothPosRef = useRef<Map<string, SmoothPos>>(new Map());
    const targetBombRef = useRef<SmoothPos | null>(null);
    const smoothBombRef = useRef<SmoothPos | null>(null);
    const smoothBoundsRef = useRef<SmoothBounds | undefined>(undefined);
    const liveBoundsRef = useRef<SmoothBounds | undefined>(undefined);
    const rafIdRef = useRef<number>(0);
    const viewportRef = useRef<HTMLDivElement>(null);
    const viewportSizeRef = useRef({ w: 260, h: 260 });
    const markerElsRef = useRef<Map<string, HTMLElement>>(new Map());
    const bombElRef = useRef<HTMLElement | null>(null);
    const prevTimeRef = useRef<number>(0);
    const hasBombRef = useRef(false);

    // Update targets + compute velocity when new GSI data arrives
    useEffect(() => {
        liveBoundsRef.current = liveBounds;
        const now = performance.now();

        const currentIds = new Set(markers.map((m) => m.steamid));
        smoothPosRef.current.forEach((_, id) => {
            if (!currentIds.has(id)) {
                smoothPosRef.current.delete(id);
                velocityRef.current.delete(id);
                markerElsRef.current.delete(id);
            }
        });

        for (const m of markers) {
            const rp = worldToRadar(mapName, { x: m.wx, y: m.wy, z: m.wz }, liveBounds);
            const prev = velocityRef.current.get(m.steamid);

            let vx = 0;
            let vy = 0;
            if (prev) {
                const dt = now - prev.stamp;
                if (dt > EXTRAP_MIN_DT) {
                    vx = (rp.x - prev.x) / dt;
                    vy = (rp.y - prev.y) / dt;
                } else {
                    // Keep previous velocity when updates arrive too fast
                    vx = prev.vx;
                    vy = prev.vy;
                }
            }

            velocityRef.current.set(m.steamid, {
                x: rp.x,
                y: rp.y,
                vx,
                vy,
                stamp: now,
            });

            if (!smoothPosRef.current.has(m.steamid)) {
                smoothPosRef.current.set(m.steamid, { x: rp.x, y: rp.y });
            }
        }

        targetBombRef.current = bombRadarPos ?? null;
        if (bombRadarPos && !smoothBombRef.current) {
            smoothBombRef.current = { x: bombRadarPos.x, y: bombRadarPos.y };
        }
        if (!bombRadarPos) {
            smoothBombRef.current = null;
            bombElRef.current = null;
        }
        hasBombRef.current = !!bombRadarPos;

        if (liveBounds && !smoothBoundsRef.current) smoothBoundsRef.current = { ...liveBounds };
        if (!liveBounds) smoothBoundsRef.current = undefined;
    }, [markers, bombRadarPos, liveBounds, mapName]);

    // rAF loop — direct DOM manipulation, zero React re-renders
    useEffect(() => {
        const tick = (now: number) => {
            const prev = prevTimeRef.current;
            prevTimeRef.current = now;

            const dt = prev ? Math.min((now - prev) / 16.667, 3) : 1;
            const alpha = 1 - Math.pow(1 - LERP, dt);
            const alphaBounds = 1 - Math.pow(1 - LERP_BOUNDS, dt);

            // Smooth bounds
            const lb = liveBoundsRef.current;
            const ss = smoothBoundsRef.current;
            if (ss && lb) {
                ss.minX += (lb.minX - ss.minX) * alphaBounds;
                ss.maxX += (lb.maxX - ss.maxX) * alphaBounds;
                ss.minY += (lb.minY - ss.minY) * alphaBounds;
                ss.maxY += (lb.maxY - ss.maxY) * alphaBounds;
            }

            const vp = viewportRef.current;
            const { w, h } = viewportSizeRef.current;
            const shotMap = shotUntilRef.current;
            const realNow = Date.now();

            // Smooth markers with extrapolation + direct DOM writes
            smoothPosRef.current.forEach((s, id) => {
                const vel = velocityRef.current.get(id);
                if (!vel) return;

                // Extrapolate target: base + velocity * clamped elapsed time
                const elapsed = Math.min(now - vel.stamp, EXTRAP_MAX_MS);
                const tx = vel.x + vel.vx * elapsed;
                const ty = vel.y + vel.vy * elapsed;

                const dx = tx - s.x;
                const dy = ty - s.y;
                if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
                    s.x += dx * alpha;
                    s.y += dy * alpha;
                } else {
                    s.x = tx;
                    s.y = ty;
                }

                // Lazy DOM element discovery
                let el = markerElsRef.current.get(id);
                if (!el || !el.isConnected) {
                    el = vp?.querySelector<HTMLElement>(`[data-steamid="${id}"]`) ?? undefined;
                    if (el) markerElsRef.current.set(id, el);
                    else {
                        markerElsRef.current.delete(id);
                        return;
                    }
                }

                el.style.transform = `translate(${(s.x / 100) * w - 8}px,${(s.y / 100) * h - 8}px)`;

                // Toggle shooting class
                const isShooting = (shotMap?.get(id) ?? 0) > realNow;
                el.classList.toggle(SHOOTING_CLASS, isShooting);
            });

            // Smooth bomb + direct DOM write
            const sb = smoothBombRef.current;
            const tb = targetBombRef.current;
            if (sb && tb) {
                const dx = tb.x - sb.x;
                const dy = tb.y - sb.y;
                if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
                    sb.x += dx * alpha;
                    sb.y += dy * alpha;
                } else {
                    sb.x = tb.x;
                    sb.y = tb.y;
                }

                let bel = bombElRef.current;
                if ((!bel || !bel.isConnected) && hasBombRef.current) {
                    bel = vp?.querySelector<HTMLElement>(".classic-radar__planted-bomb") ?? null;
                    bombElRef.current = bel;
                }
                if (bel) {
                    bel.style.transform = `translate(${(sb.x / 100) * w - 5}px,${(sb.y / 100) * h - 5}px) rotate(45deg)`;
                }
            }

            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafIdRef.current);
    }, [shotUntilRef]);

    useEffect(() => {
        const el = viewportRef.current;
        if (!el) return;
        const ro = new ResizeObserver(([entry]) => {
            const { width, height } = entry.contentRect;
            viewportSizeRef.current = { w: width, h: height };
        });
        ro.observe(el);
        return () => ro.disconnect();
    }, []);

    return { viewportRef };
}
