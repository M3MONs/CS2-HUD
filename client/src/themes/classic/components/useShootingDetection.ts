import { useEffect, useRef, useState } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { pickActiveWeapon } from "../helpers";

const SHOOTING_TTL_MS = 150;

export function useShootingDetection(players: GSIPlayer[]) {
    const previousAmmoRef = useRef<Map<string, number>>(new Map());
    const shotUntilRef = useRef<Map<string, number>>(new Map());
    const [, setShotVersion] = useState(0);

    useEffect(() => {
        const now = Date.now();
        const nextAmmo = new Map<string, number>();
        let changed = false;

        for (const p of players) {
            const ammo = pickActiveWeapon(p)?.ammo_clip;
            if (ammo === undefined) continue;

            nextAmmo.set(p.steamid, ammo);

            const prev = previousAmmoRef.current.get(p.steamid);
            if (prev !== undefined && ammo < prev) {
                shotUntilRef.current.set(p.steamid, now + SHOOTING_TTL_MS);
                changed = true;
            }
        }

        previousAmmoRef.current = nextAmmo;

        const stillActive = new Map<string, number>();
        shotUntilRef.current.forEach((until, id) => {
            if (until > now) stillActive.set(id, until);
            else changed = true;
        });
        shotUntilRef.current = stillActive;

        if (changed) setShotVersion((v) => v + 1);

        const earliest = Math.min(...Array.from(stillActive.values()));
        if (!Number.isFinite(earliest)) return;

        const timeout = window.setTimeout(
            () => setShotVersion((v) => v + 1),
            Math.max(0, earliest - Date.now()),
        );
        return () => window.clearTimeout(timeout);
    }, [players]);

    return (steamid: string) => (shotUntilRef.current.get(steamid) ?? 0) > Date.now();
}
