import { useGSISocket } from "@/hooks/useGSISocket";
import { useHudConfig } from "@/hooks/useHudConfig";
import { useThemeStyles } from "@/hooks/useThemeStyles";
import { useHUDStore } from "@/stores/HudStore";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { getThemeComponent } from "@/themes/registry";

const HUDPage = () => {
    useGSISocket();

    const { config, isLoading } = useHudConfig();
    const data = useHUDStore((s) => s.data);
    const activeThemeId = useHudConfigStore((s) => s.config?.active_theme_id ?? "classic");
    const themeStyles = useThemeStyles();

    if (isLoading || !config) {
        return (
            <div className="flex h-screen items-center justify-center text-white/40">
                Loading config…
            </div>
        );
    }

    const ThemeComponent = getThemeComponent(activeThemeId);

    return (
        <div className="relative h-screen w-screen overflow-hidden" style={themeStyles}>
            {data && <ThemeComponent data={data} elements={config.elements} />}
        </div>
    );
};

export default HUDPage;
