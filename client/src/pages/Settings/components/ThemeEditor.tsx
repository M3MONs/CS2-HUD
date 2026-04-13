import { motion } from "framer-motion";
import { useState } from "react";
import type { HudTheme, ThemeColors } from "@/types/hudConfig";
import Field from "./Field";
import Input from "./Input";

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
    ct_primary: "CT Primary",
    t_primary: "T Primary",
    background: "Background",
    text: "Text",
    accent: "Accent",
    health_bar: "Health Bar",
    armor_bar: "Armor Bar",
};

interface ThemeEditorProps {
    initial: HudTheme;
    isNew: boolean;
    onSave: (theme: HudTheme) => void;
    onCancel: () => void;
}

const ThemeEditor = ({ initial, isNew, onSave, onCancel }: ThemeEditorProps) => {
    const [draft, setDraft] = useState<HudTheme>(initial);

    const setField = <K extends keyof HudTheme>(key: K, value: HudTheme[K]) =>
        setDraft((prev) => ({ ...prev, [key]: value }));

    const setColor = (key: keyof ThemeColors, value: string) =>
        setDraft((prev) => ({ ...prev, colors: { ...prev.colors, [key]: value } }));

    const isHex = (value: string) => /^#[0-9A-Fa-f]{0,6}$/.test(value);

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 rounded-xl border border-orange-500/20 bg-neutral-900 p-5"
        >
            <div className="mb-5 grid grid-cols-2 gap-3">
                {isNew && (
                    <Field label="Theme ID" className="col-span-2">
                        <Input
                            value={draft.id}
                            onChange={(e) =>
                                setField("id", e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ""))
                            }
                            placeholder="my-theme"
                        />
                    </Field>
                )}

                <Field label="Name">
                    <Input value={draft.name} onChange={(e) => setField("name", e.target.value)} />
                </Field>

                <Field label="Font">
                    <Input value={draft.font} onChange={(e) => setField("font", e.target.value)} />
                </Field>

                <Field label="Border Radius">
                    <Input
                        value={draft.border_radius}
                        onChange={(e) => setField("border_radius", e.target.value)}
                        placeholder="4px"
                    />
                </Field>

                <Field label={`Opacity - ${draft.opacity.toFixed(2)}`}>
                    <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={draft.opacity}
                        onChange={(e) => setField("opacity", Number(e.target.value))}
                        className="mt-1.5 accent-orange-500"
                    />
                </Field>
            </div>

            <div className="mb-5 border-t border-white/5 pt-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">Colors</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {(Object.keys(draft.colors) as (keyof ThemeColors)[]).map((key) => (
                        <div key={key} className="min-w-0 flex flex-col gap-1">
                            <span className="truncate text-[10px] text-white/40">{COLOR_LABELS[key]}</span>
                            <div className="min-w-0 flex items-center gap-1.5">
                                <input
                                    type="color"
                                    value={isHex(draft.colors[key]) ? draft.colors[key] : "#000000"}
                                    onChange={(e) => setColor(key, e.target.value)}
                                    className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0.5"
                                />
                                <input
                                    type="text"
                                    value={draft.colors[key]}
                                    onChange={(e) => setColor(key, e.target.value)}
                                    className="w-full min-w-0 rounded-md bg-white/5 px-2 py-1 text-xs text-white/80 outline-none ring-1 ring-white/10 transition focus:ring-orange-500"
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex justify-end gap-2">
                <button
                    type="button"
                    onClick={onCancel}
                    className="rounded-md px-4 py-1.5 text-sm text-white/40 transition hover:text-white/70"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={() => onSave(draft)}
                    className="rounded-md bg-orange-500 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-orange-400"
                >
                    Save
                </button>
            </div>
        </motion.div>
    );
};

export default ThemeEditor;
