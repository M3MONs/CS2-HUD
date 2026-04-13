import type { GSIPlayer } from "@/types/gsi";
import type { ClassicPalette } from "./useClassicPalette";

export function sorted(p: GSIPlayer[]) {
    return [...p].sort((a, b) => (a.observer_slot ?? 0) - (b.observer_slot ?? 0));
}

export function hpC(v: number, hp: ClassicPalette["hp"]) {
    return v > 60 ? hp.hi : v > 25 ? hp.mid : hp.lo;
}

export function wpn(p: GSIPlayer) {
    const ws = Object.values(p.weapons || {});
    const m = ws.find((w) => ["rifle", "sniperrifle", "submachinegun", "shotgun", "machinegun"].includes(w.type));
    const pi = ws.find((w) => w.type === "pistol");
    const pick = m || pi;
    if (!pick) return "";
    return (pick.name || "")
        .replace(/^weapon_/, "")
        .replace(/_/g, "")
        .toUpperCase();
}

export function tc(team: string, palette: ClassicPalette) {
    return team === "CT" ? palette.ct : palette.t;
}
