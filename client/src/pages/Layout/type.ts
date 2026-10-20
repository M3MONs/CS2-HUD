import type { HudTheme } from "@/types/hudConfig";
import type { ThemeStyleValue } from "@/components/ThemeStyleFields";
import type { ElementPosition, HudComponentId, ThemeLayout, ThemeVariants } from "@/types/hudConfig";

export type VariantChangeHandler = (componentId: HudComponentId, variantId: string) => void;

export type LayoutToolbarProps = {
    themes: HudTheme[];
    selectedThemeId: string;
    onSelectTheme: (id: string) => void;
    onNavigateHome: () => void;
    onOpenColors: () => void;
    onOpenAppearance: () => void;
    variants: ThemeVariants;
    onVariantChange: VariantChangeHandler;
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

export type VariantSelectProps = {
    componentId: HudComponentId;
    value: string;
    onChange: (variantId: string) => void;
};

export type VariantPickerProps = {
    componentId: HudComponentId;
    value: string;
    onChange: VariantChangeHandler;
};

export type AppearanceModalProps = {
    open: boolean;
    variants: ThemeVariants;
    onChange: VariantChangeHandler;
    onDone: () => void;
};

export type AlignBarProps = {
    layoutKey: keyof ThemeLayout;
    position: ElementPosition;
    onChange: (pos: ElementPosition) => void;
};
