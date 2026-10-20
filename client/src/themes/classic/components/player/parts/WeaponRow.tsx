import { useRef } from "react";
import type { GSIPlayer } from "@/types/gsi";
import { pickActiveWeapon, collectGrenades } from "../../../helpers";
import { resolveWeaponImage } from "../../../weaponImages";
import { GrenadeSlot } from "./GrenadeSlot";

export const WeaponRow = ({ player, dead }: { player: GSIPlayer; dead: boolean }) => {
    const lastSrcRef = useRef<string | undefined>(undefined);
    const active = pickActiveWeapon(player);
    const freshSrc = active ? resolveWeaponImage(active.name) : undefined;
    if (freshSrc) lastSrcRef.current = freshSrc;
    const weaponSrc = freshSrc ?? lastSrcRef.current;
    const grenades = collectGrenades(player);

    // grenade SVGs are black by default — need invert;
    const isGrenade = active?.type.toLowerCase() === "grenade";
    const weaponFilter = dead
        ? isGrenade
            ? "brightness(0) invert(1) opacity(0.35)"
            : "grayscale(1) opacity(0.35)"
        : isGrenade
          ? "brightness(0) invert(1)"
          : "none";

    return (
        <div className="classic-player__weapon-row">
            <div className="classic-player__grenades-left">
                <GrenadeSlot name="smokegrenade" grenades={grenades} dead={dead} />
                <GrenadeSlot name="molotov" grenades={grenades} dead={dead} />
            </div>
            <div className="classic-player__weapon">
                {weaponSrc && (
                    <img
                        className="classic-player__weapon-img"
                        src={weaponSrc}
                        alt=""
                        draggable={false}
                        style={{ filter: weaponFilter, maxWidth: isGrenade ? "40%" : "100%" }}
                    />
                )}
            </div>
            <div className="classic-player__grenades-right">
                <GrenadeSlot name="hegrenade" grenades={grenades} dead={dead} />
                <GrenadeSlot name="flashbang" grenades={grenades} dead={dead} />
            </div>
        </div>
    );
};
