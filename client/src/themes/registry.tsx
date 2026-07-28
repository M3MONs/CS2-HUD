import type React from "react";
import type { GSIPayload } from "@/types/gsi";
import type { ElementPosition, HudElementsVisibility, ThemeLayout } from "@/types/hudConfig";
import ClassicTheme from "./classic";

export interface ThemeProps {
    data: GSIPayload;
    elements: HudElementsVisibility;
    layout: ThemeLayout;
    editable?: boolean;
    onSelectKey?: (key: keyof ThemeLayout) => void;
    onLayoutMove?: (key: keyof ThemeLayout, pos: ElementPosition) => void;
}

type ThemeComponent = React.FC<ThemeProps>;

const THEME_REGISTRY: Record<string, ThemeComponent> = {
    classic: ClassicTheme,
};

export const getThemeComponent = (themeId: string): ThemeComponent =>
    THEME_REGISTRY[themeId] ?? ClassicTheme;
