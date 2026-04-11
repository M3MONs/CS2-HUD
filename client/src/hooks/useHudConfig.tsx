import { useHudConfigStore } from "@/stores/HudConfigStore";
import { useEffect } from "react";

export const useHudConfig = () => {
    const fetchConfig = useHudConfigStore((s) => s.fetchConfig);
    const config = useHudConfigStore((s) => s.config);
    const isLoading = useHudConfigStore((s) => s.isLoading);

    useEffect(() => {
        if (!config) {
            fetchConfig();
        }
    }, [config, fetchConfig]);

    return { config, isLoading };
};