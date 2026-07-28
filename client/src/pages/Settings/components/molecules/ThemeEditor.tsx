import { motion } from "framer-motion";
import { useState } from "react";
import ThemeStyleFields from "@/components/ThemeStyleFields";
import type { HudTheme } from "@/types/hudConfig";
import type { ThemeEditorProps } from "../../type";
import Field from "../atoms/Field";
import Input from "../atoms/Input";

const ThemeEditor = ({ initial, isNew, onSave, onCancel }: ThemeEditorProps) => {
    const [draft, setDraft] = useState<HudTheme>(initial);

    const setField = <K extends keyof HudTheme>(key: K, value: HudTheme[K]) =>
        setDraft((prev) => ({ ...prev, [key]: value }));

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

                <Field label="Name" className="col-span-2">
                    <Input value={draft.name} onChange={(e) => setField("name", e.target.value)} />
                </Field>
            </div>

            <ThemeStyleFields
                value={{
                    font: draft.font,
                    border_radius: draft.border_radius,
                    opacity: draft.opacity,
                    colors: draft.colors,
                }}
                onChange={(style) => setDraft((prev) => ({ ...prev, ...style }))}
            />

            <div className="mt-5 flex justify-end gap-2">
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
