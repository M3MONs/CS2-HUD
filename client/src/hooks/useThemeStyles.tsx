import { useMemo } from "react";
import { useHudConfigStore } from "@/stores/HudConfigStore";

export const useThemeStyles = () => {
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id);
    const themes = useHudConfigStore((s) => s.config?.themes);

    return useMemo(() => {
        const theme = themes?.find((t) => t.id === activeThemeId);
        if (!theme) return {};
        return {
            "--hud-ct-primary": theme.colors.ct_primary,
            "--hud-t-primary": theme.colors.t_primary,
            "--hud-bg": theme.colors.background,
            "--hud-text": theme.colors.text,
            "--hud-accent": theme.colors.accent,
            "--hud-health": theme.colors.health_bar,
            "--hud-armor": theme.colors.armor_bar,
            "--hud-radius": theme.border_radius,
            "--hud-opacity": theme.opacity,
            fontFamily: theme.font,
        } as React.CSSProperties;
    }, [activeThemeId, themes]);
};