import { createContext, useContext } from "react";
import type { HudTheme } from "@/types/hudConfig";

export const ThemeOverrideContext = createContext<HudTheme | null>(null);

export const useThemeOverride = (): HudTheme | null => useContext(ThemeOverrideContext);
