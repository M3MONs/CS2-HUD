import type { CSSProperties, HTMLAttributes, ReactNode } from "react";
import { HUD_VIEWPORT } from "@/consts/hudViewport";
import { useFitScale } from "@/hooks/useFitScale";
import "./HudCanvas.css";

type HudCanvasProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
    maxScale?: number;
    canvasClassName?: string;
    canvasStyle?: CSSProperties;
    children?: ReactNode;
};

/**
 * Fixed 1920×1080 HUD stage scaled to fit its parent.
 * Widgets are positioned in % of this stage, so /hud and /layout render identically at any window size.
 */
const HudCanvas = ({
    maxScale,
    className = "",
    canvasClassName = "",
    canvasStyle,
    children,
    ...frameProps
}: HudCanvasProps) => {
    const [frameRef, scale] = useFitScale(HUD_VIEWPORT, maxScale);

    return (
        <div ref={frameRef} className={`hud-canvas ${className}`} {...frameProps}>
            <div
                className="hud-canvas__box"
                style={{ width: HUD_VIEWPORT.width * scale, height: HUD_VIEWPORT.height * scale }}
            >
                <div
                    className={`hud-canvas__stage ${canvasClassName}`}
                    style={{
                        width: HUD_VIEWPORT.width,
                        height: HUD_VIEWPORT.height,
                        transform: `scale(${scale})`,
                        ...canvasStyle,
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};

export default HudCanvas;
