import { createElement, type ComponentType } from "react";
import type { HudComponentId } from "@/types/hudConfig";
import type { VariantProps } from "./contracts";
import { useVariant } from "./useVariant";

type VariantElementProps<C extends HudComponentId> = { id: C } & VariantProps[C];

/** Renders the selected variant of `id`, passing the remaining props through. */
export const Variant = <C extends HudComponentId>({ id, ...props }: VariantElementProps<C>) =>
    createElement(useVariant(id) as ComponentType<VariantProps[C]>, props as unknown as VariantProps[C]);
