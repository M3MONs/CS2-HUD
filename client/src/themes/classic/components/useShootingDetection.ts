import { useEffect, useRef } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { pickActiveWeapon } from "../helpers";
import { SHOOTING_TTL_MS } from "../constants";

export function useShootingDetection(players: GSIPlayer[]) {
    const previousAmmoRef = useRef<Map<string, number>>(new Map());
    const shotUntilRef = useRef<Map<string, number>>(new Map());

    useEffect(() => {
        const now = Date.now();
        const nextAmmo = new Map<string, number>();

        for (const p of players) {
            const ammo = pickActiveWeapon(p)?.ammo_clip;
            if (ammo === undefined) continue;

            nextAmmo.set(p.steamid, ammo);

            const prev = previousAmmoRef.current.get(p.steamid);
            if (prev !== undefined && ammo < prev) {
                shotUntilRef.current.set(p.steamid, now + SHOOTING_TTL_MS);
            }
        }

        previousAmmoRef.current = nextAmmo;
    }, [players]);

    return shotUntilRef;
}
