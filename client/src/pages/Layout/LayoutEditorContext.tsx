import { createContext, useContext } from "react";
import { HUD_VIEWPORT } from "@/consts/hudViewport";

type LayoutEditorContextValue = {
    scale: number;
    width: number;
    height: number;
};

export const LayoutEditorContext = createContext<LayoutEditorContextValue>({
    scale: 1,
    width: HUD_VIEWPORT.width,
    height: HUD_VIEWPORT.height,
});

export const useLayoutEditorContext = (): LayoutEditorContextValue =>
    useContext(LayoutEditorContext);
