import { defaultTheme } from "@/consts/defaultTheme";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { useThemeOverride } from "@/themes/ThemeOverrideContext";
import type { HudComponentId } from "@/types/hudConfig";
import { getVariant } from "./registry";

/**
 * Component of the variant selected for `componentId` in the active theme
 * (or in the Layout page's unsaved draft).
 */
export const useVariant = <C extends HudComponentId>(componentId: C) => {
    const override = useThemeOverride();
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id);
    const themes = useHudConfigStore((s) => s.config?.themes);

    const theme = override ?? themes?.find((t) => t.id === activeThemeId) ?? defaultTheme;
    return getVariant(componentId, theme.variants?.[componentId]).component;
};
