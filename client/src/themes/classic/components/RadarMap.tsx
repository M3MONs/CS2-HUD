import { useMemo, useState } from "react";
import type { CSSProperties } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { fallbackMapImageUrl, parsePosition, radarImageUrl, worldToRadar } from "../helpers";
import { useClassicPalette } from "../useClassicPalette";
import { PlantedBomb } from "./PlantedBomb";
import { RadarMarkerDot } from "./RadarMarkerDot";
import { useShootingDetection } from "./useShootingDetection";
import { useSmoothRadar } from "./useSmoothRadar";
import "./style.css";

type RadarMapProps = {
    mapName?: string;
    players: GSIPlayer[];
    bombPosition?: string;
};

type RadarMarker = {
    steamid: string;
    name: string;
    team: "CT" | "T";
    slot: number;
    wx: number;
    wy: number;
    wz?: number;
    health: number;
    flashed: boolean;
    bombCarrier: boolean;
};

export const RadarMap = ({ mapName, players, bombPosition }: RadarMapProps) => {
    const C = useClassicPalette();
    const [useFallbackBg, setUseFallbackBg] = useState(false);

    const parsedBomb = useMemo(() => parsePosition(bombPosition), [bombPosition]);

    const liveBounds = useMemo(() => {
        const points = players
            .map((p) => parsePosition(p.position))
            .filter((v): v is NonNullable<typeof v> => !!v);

        if (points.length < 2) return undefined;

        const margin = 350;
        const xs = points.map((p) => p.x);
        const ys = points.map((p) => p.y);
        return {
            minX: Math.min(...xs) - margin,
            maxX: Math.max(...xs) + margin,
            minY: Math.min(...ys) - margin,
            maxY: Math.max(...ys) + margin,
        };
    }, [players]);

    const markers = useMemo<RadarMarker[]>(() => {
        return players
            .filter(
                (p): p is GSIPlayer & { team: "CT" | "T" } =>
                    (p.team === "CT" || p.team === "T") && p.state.health > 0,
            )
            .flatMap((p): RadarMarker[] => {
                const point = parsePosition(p.position);
                if (!point) return [];
                const bombCarrier = Object.values(p.weapons || {}).some(
                    (w) => w.type === "C4" || w.name === "weapon_c4",
                );
                return [{
                    steamid: p.steamid,
                    name: p.name,
                    team: p.team,
                    slot: p.observer_slot ?? -1,
                    wx: point.x,
                    wy: point.y,
                    wz: point.z,
                    health: p.state.health,
                    flashed: p.state.flashed > 70,
                    bombCarrier,
                }];
            });
    }, [players]);

    const bombRadarPos = useMemo(
        () => (parsedBomb ? worldToRadar(mapName, parsedBomb, liveBounds) : null),
        [liveBounds, mapName, parsedBomb],
    );

    const isShooting = useShootingDetection(players);
    const { smoothPosRef, smoothBombRef, smoothBoundsRef, viewportRef, viewportSizeRef } =
        useSmoothRadar({ mapName, markers, bombRadarPos, liveBounds });

    const radarBackground = useFallbackBg ? fallbackMapImageUrl(mapName) : radarImageUrl(mapName);

    return (
        <div
            className="classic-radar"
            style={{
                "--c-ff": C.ff,
                "--c-radar-ct": C.ct.solid,
                "--c-radar-t": C.t.solid,
                "--c-radar-flash": "rgba(255,255,255,0.65)",
                "--c-radar-shot": C.accent,
                "--c-radar-dead": C.w20,
                "--c-radar-bomb": C.accent,
            } as CSSProperties}
        >
            <div className="classic-radar__viewport" ref={viewportRef}>
                {radarBackground ? (
                    <img
                        className="classic-radar__map"
                        src={radarBackground}
                        alt={mapName ?? "Radar"}
                        draggable={false}
                        onError={() => { if (!useFallbackBg) setUseFallbackBg(true); }}
                    />
                ) : (
                    <div className="classic-radar__empty">No map</div>
                )}

                {markers.map((m) => {
                    const smooth =
                        smoothPosRef.current.get(m.steamid) ??
                        worldToRadar(mapName, { x: m.wx, y: m.wy, z: m.wz }, smoothBoundsRef.current);
                    const { w, h } = viewportSizeRef.current;
                    return (
                        <RadarMarkerDot
                            key={m.steamid}
                            steamid={m.steamid}
                            name={m.name}
                            team={m.team}
                            slot={m.slot}
                            flashed={m.flashed}
                            shooting={isShooting(m.steamid)}
                            bombCarrier={m.bombCarrier}
                            px={(smooth.x / 100) * w - 8}
                            py={(smooth.y / 100) * h - 8}
                        />
                    );
                })}

                {smoothBombRef.current && (
                    <PlantedBomb
                        x={smoothBombRef.current.x}
                        y={smoothBombRef.current.y}
                        vw={viewportSizeRef.current.w}
                        vh={viewportSizeRef.current.h}
                    />
                )}
            </div>
        </div>
    );
};
