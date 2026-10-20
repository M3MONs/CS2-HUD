import { resolveWeaponImage } from "../../../weaponImages";

export const GrenadeSlot = ({ name, grenades, dead }: { name: string; grenades: Map<string, number>; dead: boolean }) => {
    const rawCount =
        name === "molotov"
            ? Math.min(1, (grenades.get("molotov") ?? 0) + (grenades.get("incgrenade") ?? 0))
            : (grenades.get(name) ?? 0);

    const count = name === "flashbang" ? rawCount : Math.min(1, rawCount);

    const lookupName =
        name === "molotov" && !grenades.get("molotov") && grenades.get("incgrenade") ? "incgrenade" : name;

    const src = resolveWeaponImage(`weapon_${lookupName}`);
    const filter =
        count === 0
            ? "brightness(0) invert(1) opacity(0.15)"
            : dead
              ? "brightness(0) invert(1) opacity(0.4)"
              : "brightness(0) invert(1)";

    return (
        <div className="classic-player__grenade-slot">
            {src && (
                <>
                    <img
                        className="classic-player__grenade-img"
                        src={src}
                        alt=""
                        draggable={false}
                        style={{ filter }}
                    />
                    {name === "flashbang" && count >= 2 && <span className="classic-player__grenade-count">x2</span>}
                </>
            )}
        </div>
    );
};
