import type { ComponentType } from "react";
import type { HudComponentId } from "@/types/hudConfig";
import type { VariantProps } from "./contracts";

export const DEFAULT_VARIANT = "default";

export const COMPONENT_LABELS: Record<HudComponentId, string> = {
    scoreboard: "Scoreboard",
    player_stats: "Player stats",
    bomb_timer: "Bomb timer",
    team_economy: "Team economy",
    phase_countdown: "Phase countdown",
};

export interface VariantDef<C extends HudComponentId> {
    id: string;
    label: string;
    component: ComponentType<VariantProps[C]>;
    /** Class for the element that wraps repeated instances (e.g. the player list), when the variant changes its flow. */
    containerClassName?: string;
}

type VariantStore = { [C in HudComponentId]: Map<string, VariantDef<C>> };

const STORE: VariantStore = {
    scoreboard: new Map(),
    player_stats: new Map(),
    bomb_timer: new Map(),
    team_economy: new Map(),
    phase_countdown: new Map(),
};

const mapFor = <C extends HudComponentId>(componentId: C) =>
    STORE[componentId] as Map<string, VariantDef<C>>;

/** Register an appearance variant. Every component must register a `default` one. */
export const registerVariant = <C extends HudComponentId>(componentId: C, def: VariantDef<C>): void => {
    mapFor(componentId).set(def.id, def);
};

/** Resolve a variant; unknown or missing ids fall back to `default`. */
export const getVariant = <C extends HudComponentId>(componentId: C, variantId?: string): VariantDef<C> => {
    const variants = mapFor(componentId);
    const found = variants.get(variantId ?? DEFAULT_VARIANT) ?? variants.get(DEFAULT_VARIANT);
    if (!found) throw new Error(`No "${DEFAULT_VARIANT}" variant registered for "${componentId}"`);
    return found;
};

export const listVariants = <C extends HudComponentId>(componentId: C): VariantDef<C>[] => [
    ...mapFor(componentId).values(),
];
