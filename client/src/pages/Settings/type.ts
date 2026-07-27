import type { ReactNode } from "react";
import type { HudTheme, ThemeColors } from "@/types/hudConfig";

export type Tab = "elements" | "themes";

export interface FieldProps {
    label: string;
    children: ReactNode;
    className?: string;
}

export interface ToggleProps {
    checked: boolean;
    onChange: () => void;
}

export interface ThemeColorStripProps {
    colors: ThemeColors;
}

export interface ThemeInfoProps {
    name: string;
    id: string;
}

export interface ThemeActionsProps {
    themeId: string;
    isActive: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export interface ThemeCardProps {
    theme: HudTheme;
    isActive: boolean;
    onSelect: () => void;
    onEdit: () => void;
    onDelete: () => void;
}

export interface ColorFieldProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
}

export interface ThemeEditorProps {
    initial: HudTheme;
    isNew: boolean;
    onSave: (theme: HudTheme) => void;
    onCancel: () => void;
}

export type EditingState = { theme: HudTheme; isNew: boolean } | null;
