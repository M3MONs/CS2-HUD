import { useRef, useState, type CSSProperties, type PointerEvent, type ReactNode } from "react";
import type { ElementPosition } from "@/types/hudConfig";
import { useLayoutEditorContext } from "@/pages/Layout/LayoutEditorContext";
import { clampPos } from "./positionUtils";

type PositionedProps = {
    position: ElementPosition;
    layoutKey?: string;
    className?: string;
    style?: CSSProperties;
    centerX?: boolean;
    pinBottom?: boolean;
    anchorRight?: boolean;
    editable?: boolean;
    onSelect?: () => void;
    onMove?: (pos: ElementPosition) => void;
    children: ReactNode;
};

type DragSession = {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: ElementPosition;
};

const Positioned = ({
    position,
    layoutKey,
    className = "",
    style,
    centerX = false,
    pinBottom = false,
    anchorRight = false,
    editable = false,
    onSelect,
    onMove,
    children,
}: PositionedProps) => {
    const ref = useRef<HTMLDivElement>(null);
    const dragRef = useRef<DragSession | null>(null);
    const [dragPos, setDragPos] = useState<ElementPosition | null>(null);
    const { width, height } = useLayoutEditorContext();

    const livePos = dragPos ?? position;

    const transform = [
        centerX && "translateX(-50%)",
        anchorRight && !centerX && "translateX(-100%)",
        pinBottom && "translateY(-100%)",
    ]
        .filter(Boolean)
        .join(" ");

    const outerStyle: CSSProperties = {
        position: "absolute",
        left: `${livePos.x}%`,
        top: `${livePos.y}%`,
        ...style,
    };

    const innerStyle: CSSProperties | undefined = transform ? { transform } : undefined;

    const inner = (
        <div className={className} style={innerStyle}>
            {children}
        </div>
    );

    const resolvePos = (clientX: number, clientY: number, start: DragSession): ElementPosition => {
        const el = ref.current;
        const root = el?.offsetParent as HTMLElement | null;
        if (!el || !root) return start.startPos;

        const rootRect = root.getBoundingClientRect();
        if (rootRect.width <= 0 || rootRect.height <= 0) return start.startPos;

        const rawX = start.startPos.x + ((clientX - start.startClientX) / rootRect.width) * 100;
        const rawY = start.startPos.y + ((clientY - start.startClientY) / rootRect.height) * 100;

        return clampPos(
            rawX,
            rawY,
            el.offsetWidth,
            el.offsetHeight,
            width,
            height,
            centerX,
            pinBottom,
            anchorRight,
        );
    };

    const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        onSelect?.();

        const session: DragSession = {
            pointerId: e.pointerId,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startPos: { ...position },
        };
        dragRef.current = session;
        setDragPos(session.startPos);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const session = dragRef.current;
        if (!session || session.pointerId !== e.pointerId) return;
        setDragPos(resolvePos(e.clientX, e.clientY, session));
    };

    const endDrag = (e: PointerEvent<HTMLDivElement>) => {
        const session = dragRef.current;
        if (!session || session.pointerId !== e.pointerId) return;

        const next = resolvePos(e.clientX, e.clientY, session);
        dragRef.current = null;
        setDragPos(null);

        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }

        onMove?.(next);
    };

    if (editable) {
        return (
            <div
                ref={ref}
                data-layout-key={layoutKey}
                style={{
                    ...outerStyle,
                    cursor: dragPos ? "grabbing" : "grab",
                    touchAction: "none",
                    userSelect: "none",
                }}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={endDrag}
                onPointerCancel={endDrag}
            >
                {inner}
            </div>
        );
    }

    return <div style={outerStyle}>{inner}</div>;
};

export default Positioned;
