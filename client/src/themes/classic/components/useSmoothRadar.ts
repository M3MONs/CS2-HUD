import { useEffect, useRef, useState } from "react";
import { worldToRadar } from "../helpers";

type SmoothPos = { x: number; y: number };
type SmoothBounds = { minX: number; maxX: number; minY: number; maxY: number };
type RadarPos = { x: number; y: number };

type Marker = {
    steamid: string;
    wx: number;
    wy: number;
    wz?: number;
};

type Params = {
    mapName?: string;
    markers: Marker[];
    bombRadarPos: RadarPos | null;
    liveBounds?: SmoothBounds;
};

const LERP = 0.12;
const LERP_BOUNDS = 0.1;
const MOVE_THRESHOLD = 0.02;

export function useSmoothRadar({ mapName, markers, bombRadarPos, liveBounds }: Params) {
    const targetPosRef = useRef<Map<string, SmoothPos>>(new Map());
    const smoothPosRef = useRef<Map<string, SmoothPos>>(new Map());
    const targetBombRef = useRef<SmoothPos | null>(null);
    const smoothBombRef = useRef<SmoothPos | null>(null);
    const smoothBoundsRef = useRef<SmoothBounds | undefined>(undefined);
    const liveBoundsRef = useRef<SmoothBounds | undefined>(undefined);
    const rafIdRef = useRef<number>(0);
    const viewportRef = useRef<HTMLDivElement>(null);
    const viewportSizeRef = useRef({ w: 260, h: 260 });
    const [, setFrame] = useState(0);

    useEffect(() => {
        liveBoundsRef.current = liveBounds;

        const currentIds = new Set(markers.map((m) => m.steamid));
        smoothPosRef.current.forEach((_, id) => {
            if (!currentIds.has(id)) {
                smoothPosRef.current.delete(id);
                targetPosRef.current.delete(id);
            }
        });

        for (const m of markers) {
            const rp = worldToRadar(mapName, { x: m.wx, y: m.wy, z: m.wz }, liveBounds);
            targetPosRef.current.set(m.steamid, { x: rp.x, y: rp.y });
            if (!smoothPosRef.current.has(m.steamid)) {
                smoothPosRef.current.set(m.steamid, { x: rp.x, y: rp.y });
            }
        }

        targetBombRef.current = bombRadarPos ?? null;
        if (bombRadarPos && !smoothBombRef.current) {
            smoothBombRef.current = { x: bombRadarPos.x, y: bombRadarPos.y };
        }
        if (!bombRadarPos) smoothBombRef.current = null;

        if (liveBounds && !smoothBoundsRef.current) smoothBoundsRef.current = { ...liveBounds };
        if (!liveBounds) smoothBoundsRef.current = undefined;
    }, [markers, bombRadarPos, liveBounds, mapName]);

    useEffect(() => {
        const lerp = (a: number, b: number) => a + (b - a) * LERP_BOUNDS;

        const tick = () => {
            let dirty = false;

            smoothPosRef.current.forEach((s, id) => {
                const t = targetPosRef.current.get(id);
                if (!t) return;
                const dx = t.x - s.x;
                const dy = t.y - s.y;
                if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
                    s.x += dx * LERP;
                    s.y += dy * LERP;
                    dirty = true;
                } else {
                    s.x = t.x;
                    s.y = t.y;
                }
            });

            const sb = smoothBombRef.current;
            const tb = targetBombRef.current;
            if (sb && tb) {
                const dx = tb.x - sb.x;
                const dy = tb.y - sb.y;
                if (Math.abs(dx) > MOVE_THRESHOLD || Math.abs(dy) > MOVE_THRESHOLD) {
                    sb.x += dx * LERP;
                    sb.y += dy * LERP;
                    dirty = true;
                } else {
                    sb.x = tb.x;
                    sb.y = tb.y;
                }
            }

            const lb = liveBoundsRef.current;
            const ss = smoothBoundsRef.current;
            if (ss && lb) {
                const nminX = lerp(ss.minX, lb.minX);
                const nmaxX = lerp(ss.maxX, lb.maxX);
                const nminY = lerp(ss.minY, lb.minY);
                const nmaxY = lerp(ss.maxY, lb.maxY);
                if (
                    Math.abs(nminX - ss.minX) > 1 ||
                    Math.abs(nmaxX - ss.maxX) > 1 ||
                    Math.abs(nminY - ss.minY) > 1 ||
                    Math.abs(nmaxY - ss.maxY) > 1
                ) {
                    ss.minX = nminX;
                    ss.maxX = nmaxX;
                    ss.minY = nminY;
                    ss.maxY = nmaxY;
                    dirty = true;
                }
            }

            if (dirty) setFrame((f) => f + 1);
            rafIdRef.current = requestAnimationFrame(tick);
        };

        rafIdRef.current = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(rafIdRef.current);
    }, []);

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

    return { smoothPosRef, smoothBombRef, smoothBoundsRef, viewportRef, viewportSizeRef };
}
