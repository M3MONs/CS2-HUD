import type { ThemeColors } from "@/types/hudConfig";

export type ThemeStyleValue = {
    font: string;
    border_radius: string;
    opacity: number;
    colors: ThemeColors;
};

export type ThemeStyleFieldsProps = {
    value: ThemeStyleValue;
    onChange: (next: ThemeStyleValue) => void;
};

const isHex = (value: string) => /^#[0-9A-Fa-f]{0,6}$/.test(value);

const COLOR_LABELS: Record<keyof ThemeColors, string> = {
    ct_primary: "CT Primary",
    t_primary: "T Primary",
    background: "Background",
    text: "Text",
    accent: "Accent",
    health_bar: "Health Bar",
    armor_bar: "Armor Bar",
};

const ColorField = ({
    label,
    value,
    onChange,
}: {
    label: string;
    value: string;
    onChange: (value: string) => void;
}) => (
    <div className="min-w-0 flex flex-col gap-1">
        <span className="truncate text-[10px] text-white/40">{label}</span>
        <div className="min-w-0 flex items-center gap-1.5">
            <input
                type="color"
                value={isHex(value) ? value : "#000000"}
                onChange={(e) => onChange(e.target.value)}
                className="h-7 w-7 shrink-0 cursor-pointer rounded border-0 bg-transparent p-0.5"
            />
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full min-w-0 rounded-md bg-white/5 px-2 py-1 text-xs text-white/80 outline-none ring-1 ring-white/10 transition focus:ring-orange-500"
            />
        </div>
    </div>
);

const ThemeStyleFields = ({ value, onChange }: ThemeStyleFieldsProps) => {
    const setColor = (key: keyof ThemeColors, color: string) =>
        onChange({ ...value, colors: { ...value.colors, [key]: color } });

    return (
        <>
            <div className="mb-5 grid grid-cols-2 gap-3">
                <label className="flex min-w-0 flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">Font</span>
                    <input
                        type="text"
                        value={value.font}
                        onChange={(e) => onChange({ ...value, font: e.target.value })}
                        className="w-full rounded-md bg-white/5 px-2 py-1.5 text-sm text-white/80 outline-none ring-1 ring-white/10 transition focus:ring-orange-500"
                    />
                </label>

                <label className="flex min-w-0 flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">Border Radius</span>
                    <input
                        type="text"
                        value={value.border_radius}
                        onChange={(e) => onChange({ ...value, border_radius: e.target.value })}
                        placeholder="4px"
                        className="w-full rounded-md bg-white/5 px-2 py-1.5 text-sm text-white/80 outline-none ring-1 ring-white/10 transition focus:ring-orange-500"
                    />
                </label>

                <label className="col-span-2 flex min-w-0 flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-wider text-white/40">
                        Opacity — {value.opacity.toFixed(2)}
                    </span>
                    <input
                        type="range"
                        min={0.1}
                        max={1}
                        step={0.05}
                        value={value.opacity}
                        onChange={(e) => onChange({ ...value, opacity: Number(e.target.value) })}
                        className="mt-1.5 accent-orange-500"
                    />
                </label>
            </div>

            <div className="border-t border-white/5 pt-4">
                <p className="mb-3 text-[11px] font-medium uppercase tracking-wider text-white/30">Colors</p>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {(Object.keys(value.colors) as (keyof ThemeColors)[]).map((key) => (
                        <ColorField
                            key={key}
                            label={COLOR_LABELS[key]}
                            value={value.colors[key]}
                            onChange={(val) => setColor(key, val)}
                        />
                    ))}
                </div>
            </div>
        </>
    );
};

export default ThemeStyleFields;
