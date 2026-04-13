import { useMemo } from "react";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { defaultTheme } from "@/consts/defaultTheme";

type RGBA = { r: number; g: number; b: number; a: number };

function parseColor(input: string): RGBA | null {
    const s = input.trim();

    const hex = s.match(/^#([0-9a-fA-F]{3,8})$/);
    if (hex) {
        let h = hex[1];
        if (h.length === 3) h = h.split("").map((c) => c + c).join("");
        if (h.length === 4) h = h.split("").map((c) => c + c).join("");
        if (h.length === 6) h += "ff";
        if (h.length !== 8) return null;
        return {
            r: parseInt(h.slice(0, 2), 16),
            g: parseInt(h.slice(2, 4), 16),
            b: parseInt(h.slice(4, 6), 16),
            a: parseInt(h.slice(6, 8), 16) / 255,
        };
    }

    const rgb = s.match(
        /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+%?))?\s*\)$/i,
    );
    if (rgb) {
        const a = rgb[4] ? (rgb[4].endsWith("%") ? parseFloat(rgb[4]) / 100 : +rgb[4]) : 1;
        return { r: +rgb[1], g: +rgb[2], b: +rgb[3], a };
    }

    return null;
}

function withAlpha(color: string, alpha: number): string {
    const c = parseColor(color);
    if (!c) return color;
    return `rgba(${Math.round(c.r)}, ${Math.round(c.g)}, ${Math.round(c.b)}, ${alpha})`;
}

function darken(color: string, amount: number): string {
    const c = parseColor(color);
    if (!c) return color;
    const f = 1 - amount;
    return `rgba(${Math.round(c.r * f)}, ${Math.round(c.g * f)}, ${Math.round(c.b * f)}, ${c.a})`;
}

function teamPalette(base: string) {
    return {
        solid: base,
        grad: `linear-gradient(180deg, ${base} 0%, ${darken(base, 0.15)} 100%)`,
        glow: withAlpha(base, 0.3),
    };
}

export const useClassicPalette = () => {
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id);
    const themes = useHudConfigStore((s) => s.config?.themes);

    return useMemo(() => {
        const theme = themes?.find((t) => t.id === activeThemeId) ?? defaultTheme;
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
    }, [activeThemeId, themes]);
};

export type ClassicPalette = ReturnType<typeof useClassicPalette>;
