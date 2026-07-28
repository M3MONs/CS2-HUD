import type { HudTheme } from "@/types/hudConfig";
import type { ThemeStyleValue } from "@/components/ThemeStyleFields";
import type { ElementPosition, ThemeLayout } from "@/types/hudConfig";

export type LayoutToolbarProps = {
    themes: HudTheme[];
    selectedThemeId: string;
    onSelectTheme: (id: string) => void;
    onNavigateHome: () => void;
    onOpenColors: () => void;
    onResetLayout: () => void;
    onSave: () => void;
    onDiscard: () => void;
    isDirty: boolean;
    usingMock?: boolean;
};

export type StyleModalProps = {
    open: boolean;
    style: ThemeStyleValue;
    onStyleChange: (style: ThemeStyleValue) => void;
    onSave: () => void;
    onCancel: () => void;
    onReset: () => void;
};

export type AlignBarProps = {
    layoutKey: keyof ThemeLayout;
    position: ElementPosition;
    onChange: (pos: ElementPosition) => void;
};
