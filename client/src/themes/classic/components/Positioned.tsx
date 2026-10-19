import type { CSSProperties, ReactNode } from "react";
import type { ElementPosition } from "@/types/hudConfig";
import type { SlotAnchors } from "./positionUtils";
import { useDragPosition } from "./useDragPosition";

type PositionedProps = SlotAnchors & {
    position: ElementPosition;
    layoutKey?: string;
    className?: string;
    style?: CSSProperties;
    editable?: boolean;
    onSelect?: () => void;
    onMove?: (pos: ElementPosition) => void;
    children: ReactNode;
};

const anchorTransform = ({ centerX, pinBottom, anchorRight }: SlotAnchors) =>
    [
        centerX && "translateX(-50%)",
        anchorRight && !centerX && "translateX(-100%)",
        pinBottom && "translateY(-100%)",
    ]
        .filter(Boolean)
        .join(" ");

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
    const anchors = { centerX, pinBottom, anchorRight };
    const { ref, livePos, isDragging, handlers } = useDragPosition({
        position,
        anchors,
        onSelect,
        onMove,
    });

    const transform = anchorTransform(anchors);

    const outerStyle: CSSProperties = {
        position: "absolute",
        left: `${livePos.x}%`,
        top: `${livePos.y}%`,
        ...style,
    };

    const inner = (
        <div className={className} style={transform ? { transform } : undefined}>
            {children}
        </div>
    );

    if (!editable) {
        return <div style={outerStyle}>{inner}</div>;
    }

    return (
        <div
            ref={ref}
            data-layout-key={layoutKey}
            style={{
                ...outerStyle,
                cursor: isDragging ? "grabbing" : "grab",
                touchAction: "none",
                userSelect: "none",
            }}
            {...handlers}
        >
            {inner}
        </div>
    );
};

export default Positioned;
