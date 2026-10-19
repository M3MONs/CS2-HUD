import { createElement, useRef, useState } from "react";
import { useNavigate } from "react-router";
import HudCanvas from "@/components/HudCanvas";
import type { ThemeStyleValue } from "@/components/ThemeStyleFields";
import { DEFAULT_THEME_LAYOUT, defaultTheme } from "@/consts/defaultTheme";
import { useGSISocket } from "@/hooks/useGSISocket";
import { useHudConfig } from "@/hooks/useHudConfig";
import { useHUDStore } from "@/stores/HudStore";
import { useHudConfigStore } from "@/stores/HudConfigStore";
import { ThemeOverrideContext } from "@/themes/ThemeOverrideContext";
import { getThemeComponent } from "@/themes/registry";
import type { ElementPosition, HudTheme, ThemeLayout } from "@/types/hudConfig";
import { clampPos, SLOT_ANCHORS } from "@/themes/classic/components/positionUtils";
import LayoutToolbar from "./components/organisms/LayoutToolbar";
import StyleModal from "./components/molecules/StyleModal";
import { MOCK_LAYOUT_GSI } from "./mockGsiData";
import "./style.css";

const styleFromTheme = (theme: HudTheme): ThemeStyleValue => ({
    font: theme.font,
    border_radius: theme.border_radius,
    opacity: theme.opacity,
    colors: theme.colors,
});

const withStyle = (theme: HudTheme, style: ThemeStyleValue): HudTheme => ({
    ...theme,
    ...style,
    colors: { ...style.colors },
});

const normalizeLayout = (layout?: Partial<ThemeLayout> | null): ThemeLayout => ({
    scoreboard: { ...(layout?.scoreboard ?? DEFAULT_THEME_LAYOUT.scoreboard) },
    bomb_timer: { ...(layout?.bomb_timer ?? DEFAULT_THEME_LAYOUT.bomb_timer) },
    team_ct: { ...(layout?.team_ct ?? DEFAULT_THEME_LAYOUT.team_ct) },
    team_t: { ...(layout?.team_t ?? DEFAULT_THEME_LAYOUT.team_t) },
    minimap: { ...(layout?.minimap ?? DEFAULT_THEME_LAYOUT.minimap) },
});

const cloneLayout = (layout: ThemeLayout = DEFAULT_THEME_LAYOUT): ThemeLayout => normalizeLayout(layout);

const themeSnapshot = (theme: HudTheme): HudTheme => ({
    ...theme,
    colors: { ...theme.colors },
    layout: cloneLayout(theme.layout),
});

const isSameTheme = (a: HudTheme, b: HudTheme): boolean => JSON.stringify(a) === JSON.stringify(b);

const LayoutPage = () => {
    useGSISocket();
    const navigate = useNavigate();
    const { config, isLoading } = useHudConfig();
    const data = useHUDStore((s) => s.data);
    const updateTheme = useHudConfigStore((s) => s.updateTheme);
    const previewData = data ?? MOCK_LAYOUT_GSI;
    const usingMock = !data;

    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
    const [draftTheme, setDraftTheme] = useState<HudTheme | null>(null);
    const [baselineTheme, setBaselineTheme] = useState<HudTheme | null>(null);
    const [draftThemeId, setDraftThemeId] = useState<string | null>(null);
    const [styleModalOpen, setStyleModalOpen] = useState(false);
    const [styleModalBaseline, setStyleModalBaseline] = useState<ThemeStyleValue | null>(null);
    const [selectedKey, setSelectedKey] = useState<keyof ThemeLayout | null>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    const effectiveThemeId = selectedThemeId ?? config?.active_theme_id ?? "classic";
    const storeTheme =
        config?.themes.find((t) => t.id === effectiveThemeId) ?? config?.themes[0] ?? null;

    if (storeTheme && draftThemeId !== effectiveThemeId) {
        setDraftThemeId(effectiveThemeId);
        const next = themeSnapshot({
            ...storeTheme,
            layout: normalizeLayout(storeTheme.layout),
        });
        setDraftTheme(next);
        setBaselineTheme(themeSnapshot(next));
        setSelectedKey(null);
    }

    if (isLoading || !config || !draftTheme || !baselineTheme || !storeTheme) {
        return (
            <div className="flex h-screen items-center justify-center text-white/40">Loading…</div>
        );
    }

    const isDirty = !isSameTheme(draftTheme, baselineTheme);

    const handleSelectTheme = (id: string) => {
        if (id === effectiveThemeId) return;
        if (isDirty && !window.confirm("Discard unsaved changes?")) return;
        setSelectedThemeId(id);
    };

    const handleNavigateHome = () => {
        if (isDirty && !window.confirm("Discard unsaved changes?")) return;
        navigate("/");
    };

    const handleLayoutMove = (key: keyof ThemeLayout, pos: ElementPosition) => {
        setDraftTheme({
            ...draftTheme,
            layout: { ...draftTheme.layout, [key]: pos },
        });
        setSelectedKey(key);
    };

    const handlePositionChange = (pos: ElementPosition) => {
        if (!selectedKey) return;

        const selectedNode = previewRef.current?.querySelector<HTMLElement>(
            `[data-layout-key="${selectedKey}"]`,
        );
        const nextPos = selectedNode
            ? clampPos(
                pos,
                { width: selectedNode.offsetWidth, height: selectedNode.offsetHeight },
                SLOT_ANCHORS[selectedKey],
            )
            : pos;

        setDraftTheme({
            ...draftTheme,
            layout: { ...draftTheme.layout, [selectedKey]: nextPos },
        });
    };

    const handleSave = async () => {
        if (!isDirty) return;
        if (!window.confirm("Save layout & style for this theme?")) return;
        const saved = await updateTheme(draftTheme.id, draftTheme);
        if (!saved) {
            const reason = useHudConfigStore.getState().error ?? "unknown error";
            window.alert(`Save failed: ${reason}. Your changes are kept as unsaved.`);
            return;
        }
        setBaselineTheme(themeSnapshot(draftTheme));
    };

    const handleDiscard = () => {
        if (!isDirty) return;
        if (!window.confirm("Discard unsaved changes?")) return;
        setDraftTheme(themeSnapshot(baselineTheme));
        setSelectedKey(null);
    };

    const handleResetLayout = () => {
        if (!window.confirm("Reset widget positions to defaults? (unsaved until you Save)")) return;
        setDraftTheme({ ...draftTheme, layout: cloneLayout() });
    };

    const openColors = () => {
        setStyleModalBaseline(styleFromTheme(draftTheme));
        setStyleModalOpen(true);
    };

    const handleStyleChange = (style: ThemeStyleValue) => {
        setDraftTheme(withStyle(draftTheme, style));
    };

    const handleStyleDone = () => {
        setStyleModalOpen(false);
        setStyleModalBaseline(null);
    };

    const handleStyleCancel = () => {
        if (styleModalBaseline) {
            setDraftTheme(withStyle(draftTheme, styleModalBaseline));
        }
        setStyleModalOpen(false);
        setStyleModalBaseline(null);
    };

    const handleStyleReset = () => {
        if (!window.confirm("Reset colors/style to defaults? (unsaved until you Save)")) return;
        setDraftTheme(withStyle(draftTheme, styleFromTheme(defaultTheme)));
    };

    return (
        <div className="layout-page">
            <div
                ref={previewRef}
                className="layout-page__preview"
                onPointerDown={() => setSelectedKey(null)}
            >
                <HudCanvas
                    maxScale={1}
                    canvasClassName="layout-page__canvas"
                    canvasStyle={{ fontFamily: draftTheme.font, opacity: draftTheme.opacity }}
                >
                    <ThemeOverrideContext.Provider value={draftTheme}>
                        {createElement(getThemeComponent(effectiveThemeId), {
                            data: previewData,
                            elements: config.elements,
                            layout: draftTheme.layout,
                            editable: true,
                            onSelectKey: setSelectedKey,
                            onLayoutMove: handleLayoutMove,
                        })}
                    </ThemeOverrideContext.Provider>
                </HudCanvas>
            </div>

            <LayoutToolbar
                themes={config.themes}
                selectedThemeId={effectiveThemeId}
                onSelectTheme={handleSelectTheme}
                onNavigateHome={handleNavigateHome}
                onOpenColors={openColors}
                onResetLayout={handleResetLayout}
                onSave={() => void handleSave()}
                onDiscard={handleDiscard}
                isDirty={isDirty}
                usingMock={usingMock}
                selectedKey={selectedKey}
                selectedPosition={selectedKey ? draftTheme.layout[selectedKey] : null}
                onPositionChange={handlePositionChange}
            />

            <StyleModal
                open={styleModalOpen}
                style={styleFromTheme(draftTheme)}
                onStyleChange={handleStyleChange}
                onSave={handleStyleDone}
                onCancel={handleStyleCancel}
                onReset={handleStyleReset}
            />
        </div>
    );
};

export default LayoutPage;
