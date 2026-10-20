import { useRef, useState, type PointerEvent } from "react";
import type { ElementPosition } from "@/types/hudConfig";
import { clampPos, type SlotAnchors } from "./positionUtils";

type DragSession = {
    pointerId: number;
    startClientX: number;
    startClientY: number;
    startPos: ElementPosition;
    moved: boolean;
};

type UseDragPositionArgs = {
    position: ElementPosition;
    anchors: SlotAnchors;
    onSelect?: () => void;
    onMove?: (pos: ElementPosition) => void;
};

/** Pointer-drag of an absolutely positioned element, in % of its offsetParent. */
export const useDragPosition = ({ position, anchors, onSelect, onMove }: UseDragPositionArgs) => {
    const ref = useRef<HTMLDivElement>(null);
    const sessionRef = useRef<DragSession | null>(null);
    const [dragPos, setDragPos] = useState<ElementPosition | null>(null);

    const resolvePos = (clientX: number, clientY: number, session: DragSession): ElementPosition => {
        const el = ref.current;
        const root = el?.offsetParent as HTMLElement | null;
        if (!el || !root) return session.startPos;

        const rootRect = root.getBoundingClientRect();
        if (rootRect.width <= 0 || rootRect.height <= 0) return session.startPos;

        const raw = {
            x: session.startPos.x + ((clientX - session.startClientX) / rootRect.width) * 100,
            y: session.startPos.y + ((clientY - session.startClientY) / rootRect.height) * 100,
        };
        return clampPos(raw, { width: el.offsetWidth, height: el.offsetHeight }, anchors);
    };

    const activeSession = (e: PointerEvent<HTMLDivElement>) => {
        const session = sessionRef.current;
        return session && session.pointerId === e.pointerId ? session : null;
    };

    const finish = (e: PointerEvent<HTMLDivElement>) => {
        sessionRef.current = null;
        setDragPos(null);
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
            e.currentTarget.releasePointerCapture(e.pointerId);
        }
    };

    const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
        if (e.button !== 0) return;
        e.stopPropagation();
        e.preventDefault();
        onSelect?.();

        const session: DragSession = {
            pointerId: e.pointerId,
            startClientX: e.clientX,
            startClientY: e.clientY,
            startPos: { ...position },
            moved: false,
        };
        sessionRef.current = session;
        setDragPos(session.startPos);
        e.currentTarget.setPointerCapture(e.pointerId);
    };

    const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
        const session = activeSession(e);
        if (!session) return;
        if (e.clientX !== session.startClientX || e.clientY !== session.startClientY) {
            session.moved = true;
        }
        setDragPos(resolvePos(e.clientX, e.clientY, session));
    };

    const onPointerUp = (e: PointerEvent<HTMLDivElement>) => {
        const session = activeSession(e);
        if (!session) return;
        const next = resolvePos(e.clientX, e.clientY, session);
        finish(e);
        // A plain click selects only; it must not rewrite the stored position.
        if (session.moved) onMove?.(next);
    };

    // Cancel coordinates are unreliable (often 0,0): drop the drag, keep the original position.
    const onPointerCancel = (e: PointerEvent<HTMLDivElement>) => {
        if (!activeSession(e)) return;
        finish(e);
    };

    return {
        ref,
        livePos: dragPos ?? position,
        isDragging: dragPos !== null,
        handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerCancel },
    };
};
