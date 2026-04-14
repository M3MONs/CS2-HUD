import type { HudTheme, ThemeColors } from "@/types/hudConfig";

interface ThemeColorStripProps {
    colors: ThemeColors;
}

const ThemeColorStrip = ({ colors }: ThemeColorStripProps) => (
    <div className="mb-3 flex h-8 gap-1 overflow-hidden rounded-md">
        {(["ct_primary", "t_primary", "accent", "health_bar", "armor_bar"] as const).map((k) => (
            <div key={k} className="flex-1" style={{ backgroundColor: colors[k] }} />
        ))}
    </div>
);

interface ThemeInfoProps {
    name: string;
    id: string;
}

const ThemeInfo = ({ name, id }: ThemeInfoProps) => (
    <div>
        <p className="text-sm font-medium text-white">{name}</p>
        <p className="text-xs text-white/30">{id}</p>
    </div>
);

interface ThemeActionsProps {
    themeId: string;
    isActive: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const ThemeActions = ({ themeId, isActive, onSelect, onEdit, onDelete }: ThemeActionsProps) => (
    <div className="flex shrink-0 items-center gap-1">
        {isActive ? (
            <span className="rounded-full bg-orange-500/20 px-2 py-0.5 text-[11px] font-medium text-orange-400">
                Active
            </span>
        ) : (
            <button
                type="button"
                onClick={onSelect}
                className="rounded-md px-2 py-1 text-xs text-white/40 transition hover:bg-white/10 hover:text-white"
            >
                Set active
            </button>
        )}
        <button
            type="button"
            onClick={onEdit}
            className="rounded-md p-1 text-white/30 transition hover:bg-white/10 hover:text-white"
            title="Edit"
        >
            <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M11.5 2.5l2 2L5 13H3v-2L11.5 2.5z" />
            </svg>
        </button>
        {themeId !== "classic" && (
            <button
                type="button"
                onClick={onDelete}
                className="rounded-md p-1 text-white/30 transition hover:bg-red-500/20 hover:text-red-400"
                title="Delete"
            >
                <svg className="h-4 w-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M3 4h10M6 4V2h4v2M5 4l.5 9h5L11 4" />
                </svg>
            </button>
        )}
    </div>
);

interface ThemeCardProps {
    theme: HudTheme;
    isActive: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

const ThemeCard = ({ theme, isActive, onSelect, onEdit, onDelete }: ThemeCardProps) => (
    <div
        className={`rounded-xl border p-4 transition ${
            isActive
                ? "border-orange-500/50 bg-orange-500/10"
                : "border-white/5 bg-white/5 hover:bg-white/[0.07]"
        }`}
    >
        <ThemeColorStrip colors={theme.colors} />
        <div className="flex items-start justify-between gap-2">
            <ThemeInfo name={theme.name} id={theme.id} />
            <ThemeActions
                themeId={theme.id}
                isActive={isActive}
                onSelect={onSelect}
                onEdit={onEdit}
                onDelete={onDelete}
            />
        </div>
    </div>
);

export default ThemeCard;
