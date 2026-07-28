import {
    useLayoutEffect,
    useRef,
    useState,
    type PointerEvent as ReactPointerEvent,
} from "react";
import type { ElementPosition, ThemeLayout } from "@/types/hudConfig";
import type { LayoutToolbarProps } from "../../type";
import AlignBar from "../molecules/AlignBar";

type Props = LayoutToolbarProps & {
    selectedKey: keyof ThemeLayout | null;
    selectedPosition: ElementPosition | null;
    onPositionChange: (pos: ElementPosition) => void;
};

type PanelPos = { x: number; y: number };

const STORAGE_KEY = "layout-toolbar-pos";
const MARGIN = 8;

const readStoredPos = (): PanelPos | null => {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw) as PanelPos;
        if (typeof parsed.x !== "number" || typeof parsed.y !== "number") return null;
        return parsed;
    } catch {
        return null;
    }
};

const clampPos = (x: number, y: number, w: number, h: number): PanelPos => {
    const maxX = Math.max(MARGIN, window.innerWidth - w - MARGIN);
    const maxY = Math.max(MARGIN, window.innerHeight - h - MARGIN);
    return {
        x: Math.min(maxX, Math.max(MARGIN, x)),
        y: Math.min(maxY, Math.max(MARGIN, y)),
    };
};

const LayoutToolbar = ({
    themes,
    selectedThemeId,
    onSelectTheme,
    onNavigateHome,
    onOpenColors,
    onResetLayout,
    onSave,
    onDiscard,
    isDirty,
    usingMock = false,
    selectedKey,
    selectedPosition,
    onPositionChange,
}: Props) => {
    const stackRef = useRef<HTMLDivElement>(null);
    const dragRef = useRef<{
        pointerId: number;
        startX: number;
        startY: number;
        originX: number;
        originY: number;
    } | null>(null);
    const [pos, setPos] = useState<PanelPos | null>(null);

    useLayoutEffect(() => {
        const el = stackRef.current;
        if (!el) return;

        const place = () => {
            const w = el.offsetWidth;
            const h = el.offsetHeight;
            const stored = readStoredPos();
            const next = stored
                ? clampPos(stored.x, stored.y, w, h)
                : clampPos((window.innerWidth - w) / 2, 12, w, h);
            setPos(next);
        };

        place();

        const onResize = () => {
            setPos((prev) => {
                if (!prev) return prev;
                return clampPos(prev.x, prev.y, el.offsetWidth, el.offsetHeight);
            });
        };
        window.addEventListener("resize", onResize);
        return () => window.removeEventListener("resize", onResize);
    }, [selectedKey]);

    const persist = (next: PanelPos) => {
        setPos(next);
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        } catch {
            /* ignore quota / private mode */
        }
    };

    const onHandleDown = (e: ReactPointerEvent<HTMLButtonElement>) => {
        if (e.button !== 0 || !pos) return;
        e.preventDefault();
        e.stopPropagation();
        dragRef.current = {
            pointerId: e.pointerId,
            startX: e.clientX,
            startY: e.clientY,
            originX: pos.x,
            originY: pos.y,
        };
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onHandleMove = (e: ReactPointerEvent<HTMLButtonElement>) => {
        const session = dragRef.current;
        const el = stackRef.current;
        if (!session || session.pointerId !== e.pointerId || !el) return;
        persist(
            clampPos(
                session.originX + (e.clientX - session.startX),
                session.originY + (e.clientY - session.startY),
                el.offsetWidth,
                el.offsetHeight,
            ),
        );
    };

    const onHandleUp = (e: ReactPointerEvent<HTMLButtonElement>) => {
        const session = dragRef.current;
        if (!session || session.pointerId !== e.pointerId) return;
        dragRef.current = null;
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    return (
        <div
            ref={stackRef}
            className="layout-toolbar-stack"
            style={pos ? { left: pos.x, top: pos.y } : { left: -9999, top: 0, visibility: "hidden" }}
        >
            <div className="layout-toolbar">
                <button
                    type="button"
                    className="layout-toolbar__handle"
                    aria-label="Move toolbar"
                    title="Drag to move"
                    onPointerDown={onHandleDown}
                    onPointerMove={onHandleMove}
                    onPointerUp={onHandleUp}
                    onPointerCancel={onHandleUp}
                >
                    ⋮⋮
                </button>

                <button
                    type="button"
                    className="layout-toolbar__btn layout-toolbar__btn--ghost"
                    onClick={onNavigateHome}
                >
                    ← Home
                </button>

                <select
                    className="layout-toolbar__select"
                    value={selectedThemeId}
                    onChange={(e) => onSelectTheme(e.target.value)}
                    aria-label="Theme"
                >
                    {themes.map((t) => (
                        <option key={t.id} value={t.id}>
                            {t.name || t.id}
                        </option>
                    ))}
                </select>

                {usingMock && <span className="layout-toolbar__badge">Mock preview</span>}
                {isDirty && (
                    <span className="layout-toolbar__badge layout-toolbar__badge--dirty">Unsaved</span>
                )}

                <button
                    type="button"
                    className="layout-toolbar__btn layout-toolbar__btn--primary"
                    onClick={onOpenColors}
                >
                    Colors
                </button>

                <button
                    type="button"
                    className="layout-toolbar__btn layout-toolbar__btn--primary"
                    onClick={onSave}
                    disabled={!isDirty}
                >
                    Save
                </button>

                <button
                    type="button"
                    className="layout-toolbar__btn layout-toolbar__btn--ghost"
                    onClick={onDiscard}
                    disabled={!isDirty}
                >
                    Discard
                </button>

                <button
                    type="button"
                    className="layout-toolbar__btn layout-toolbar__btn--ghost"
                    onClick={onResetLayout}
                >
                    Reset layout
                </button>
            </div>

            {selectedKey && selectedPosition && (
                <AlignBar layoutKey={selectedKey} position={selectedPosition} onChange={onPositionChange} />
            )}
        </div>
    );
};

export default LayoutToolbar;
