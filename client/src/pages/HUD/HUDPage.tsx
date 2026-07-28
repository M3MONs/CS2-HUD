import { createElement } from "react";
import { useGSISocket } from "@/hooks/useGSISocket";
import { useHudConfig } from "@/hooks/useHudConfig";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useHUDStore } from "@/stores/HudStore";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { DEFAULT_THEME_LAYOUT } from "@/consts/defaultTheme";
import { getThemeComponent } from "@/themes/registry";
import "./style.css";

const HUDPage = () => {
    useGSISocket();

    const { config, isLoading } = useHudConfig();
    const data = useHUDStore((s) => s.data);
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id ?? "classic");
    const getActiveTheme = useHudConfigStore((s) => s.getActiveTheme);
    const themeStyles = useThemeStyles();

    if (isLoading || !config) {
        return (
            <div className="flex h-screen items-center justify-center text-white/40">
                Loading config…
            </div>
        );
    }

    const layout = getActiveTheme()?.layout ?? DEFAULT_THEME_LAYOUT;

    return (
        <div className="relative h-screen w-screen overflow-hidden" style={themeStyles}>
            {data &&
                createElement(getThemeComponent(activeThemeId), {
                    data,
                    elements: config.elements,
                    layout,
                })}
        </div>
    );
};

export default HUDPage;
