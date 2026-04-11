import { apiConfig } from "@/api/apiConfig";
import { defaultTheme } from "@/consts/defaultTheme";
import type { HudConfig, HudElementsVisibility, HudTheme } from "@/types/hudConfig";
import { create } from "zustand";

interface HudConfigState {
    config: HudConfig | null;
    isLoading: boolean;
    error: string | null;

    fetchConfig: () => Promise<void>;
    toggleElement: (key: keyof HudElementsVisibility) => Promise<void>;
    setActiveTheme: (themeId: string) => Promise<void>;
    addTheme: (theme: HudTheme) => Promise<void>;
    updateTheme: (themeId: string, theme: HudTheme) => Promise<void>;
    deleteTheme: (themeId: string) => Promise<void>;
    getActiveTheme: () => HudTheme | undefined;
}

export const useHudConfigStore = create<HudConfigState>((set, get) => ({
    config: null,
    isLoading: false,
    error: null,

    fetchConfig: async () => {
        set({ isLoading: true, error: null });
        try {
            const config = await apiConfig.get();
            set({ config: config.data, isLoading: false });
        } catch (e) {
            set({ error: (e as Error).message, isLoading: false });
        }
    },

    toggleElement: async (key) => {
        const { config } = get();
        if (!config) return;

        const updated: HudConfig = {
            ...config,
            elements: {
                ...config.elements,
                [key]: !config.elements[key],
            },
        };

        // Optimistic update
        set({ config: updated });

        try {
            const saved = await apiConfig.patch({
                elements: updated.elements,
            });
            set({ config: saved.data });
        } catch (e) {
            // Rollback on error
            set({ config, error: (e as Error).message });
        }
    },

    setActiveTheme: async (themeId) => {
        const { config } = get();
        if (!config) return;

        const updated = { ...config, active_theme_id: themeId };
        set({ config: updated });

        try {
            const saved = await apiConfig.patch({ active_theme_id: themeId });
            set({ config: saved.data });
        } catch (e) {
            set({ config, error: (e as Error).message });
        }
    },

    addTheme: async (theme) => {
        try {
            const saved = await apiConfig.addTheme(theme);
            set({ config: saved.data });
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },

    updateTheme: async (themeId, theme) => {
        const { config } = get();
        if (!config) return;

        const optimistic = {
            ...config,
            themes: config.themes.map((t) => (t.id === themeId ? theme : t)),
        };
        set({ config: optimistic });

        try {
            const saved = await apiConfig.updateTheme(themeId, theme);
            set({ config: saved.data });
        } catch (e) {
            set({ config, error: (e as Error).message });
        }
    },

    deleteTheme: async (themeId) => {
        try {
            const saved = await apiConfig.deleteTheme(themeId);
            set({ config: saved.data });
        } catch (e) {
            set({ error: (e as Error).message });
        }
    },

    getActiveTheme: () => {
        const { config } = get();
        if (!config) return defaultTheme;
        return config.themes.find((t) => t.id === config.active_theme_id) ?? defaultTheme;
    },
}));
