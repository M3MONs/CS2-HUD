import { useMemo } from "react";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { defaultTheme } from "@/consts/defaultTheme";
import { useThemeOverride } from "@/themes/ThemeOverrideContext";
import { withAlpha, teamPalette } from "./helpers";
import type { ClassicPalette } from "./types";

export type { ClassicPalette } from "./types";

/**
 * Hook to get the classic palette based on the active theme (or layout preview override).
 */
export const useClassicPalette = (): ClassicPalette => {
    const override = useThemeOverride();
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id);
    const themes = useHudConfigStore((s) => s.config?.themes);

    return useMemo(() => {
        const theme =
            override ?? themes?.find((t) => t.id === activeThemeId) ?? defaultTheme;
        const { colors, font } = theme;
        const text = colors.text;

        return {
            ff: font,
            ct: teamPalette(colors.ct_primary),
            t: teamPalette(colors.t_primary),
            hp: {
                hi: colors.health_bar,
                mid: "#D4C23B",
                lo: "#D44040",
            },
            armor: colors.armor_bar,
            accent: colors.accent,
            bg: colors.background,
            div: withAlpha(text, 0.07),
            w: text,
            w90: withAlpha(text, 0.9),
            w70: withAlpha(text, 0.7),
            w40: withAlpha(text, 0.4),
            w20: withAlpha(text, 0.2),
            w08: withAlpha(text, 0.08),
            money: "#2DD45B",
            dead: "rgba(200, 45, 45, 0.80)",
        };
    }, [override, activeThemeId, themes]);
};
