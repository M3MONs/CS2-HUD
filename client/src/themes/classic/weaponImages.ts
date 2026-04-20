const raw = import.meta.glob<{ default: string }>(
    "../../assets/weapons/*.svg",
    { eager: true }
);

export const weaponImageMap: Record<string, string> = Object.fromEntries(
    Object.entries(raw).map(([path, mod]) => {
        const key = path.split("/").at(-1)!.replace(/\.svg$/, "");
        return [key, mod.default];
    })
);

export function resolveWeaponImage(weaponName: string): string | undefined {
    const bare = weaponName.replace(/^weapon_/, "");
    return weaponImageMap[bare] ?? (bare.startsWith("knife") ? weaponImageMap["knife"] : undefined);
}
