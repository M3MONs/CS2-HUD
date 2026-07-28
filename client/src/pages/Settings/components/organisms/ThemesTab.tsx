import { useState } from "react";
import { DEFAULT_THEME_LAYOUT, defaultTheme } from "@/consts/defaultTheme";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import type { HudTheme } from "@/types/hudConfig";
import type { EditingState } from "../../type";
import ThemeCard from "../molecules/ThemeCard";
import ThemeEditor from "../molecules/ThemeEditor";

const createEmptyTheme = (): HudTheme => ({
    ...defaultTheme,
    id: "",
    name: "",
    colors: { ...defaultTheme.colors, background: "#000000" },
    layout: { ...DEFAULT_THEME_LAYOUT },
});

const ThemesTab = () => {
    const config = useHudConfigStore((s) => s.config);
    const setActiveTheme = useHudConfigStore((s) => s.setActiveTheme);
    const addTheme = useHudConfigStore((s) => s.addTheme);
    const updateTheme = useHudConfigStore((s) => s.updateTheme);
    const deleteTheme = useHudConfigStore((s) => s.deleteTheme);
    const [editing, setEditing] = useState<EditingState>(null);

    if (!config) return null;

    const handleSave = async (theme: HudTheme) => {
        if (editing?.isNew) {
            await addTheme(theme);
        } else {
            await updateTheme(theme.id, theme);
        }
        setEditing(null);
    };

    return (
        <div>
            <div className="mb-3 flex justify-end">
                <button
                    type="button"
                    onClick={() => setEditing({ theme: createEmptyTheme(), isNew: true })}
                    className="flex items-center gap-1.5 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition hover:bg-orange-400"
                >
                    <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M8 3v10M3 8h10" />
                    </svg>
                    New Theme
                </button>
            </div>

            {editing?.isNew && (
                <ThemeEditor
                    initial={editing.theme}
                    isNew
                    onSave={handleSave}
                    onCancel={() => setEditing(null)}
                />
            )}

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {config.themes.map((theme) => (
                    <div key={theme.id}>
                        <ThemeCard
                            theme={theme}
                            isActive={theme.id === config.active_theme_id}
                            onSelect={() => setActiveTheme(theme.id)}
                            onEdit={() => setEditing({ theme, isNew: false })}
                            onDelete={() => deleteTheme(theme.id)}
                        />
                        {editing && !editing.isNew && editing.theme.id === theme.id && (
                            <ThemeEditor
                                initial={editing.theme}
                                isNew={false}
                                onSave={handleSave}
                                onCancel={() => setEditing(null)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ThemesTab;
