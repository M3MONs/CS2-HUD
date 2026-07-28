import type { MouseEvent } from "react";
import type { AlignBarProps } from "../../type";
import type { ElementPosition } from "@/types/hudConfig";

const AlignBar = ({ layoutKey, position, onChange }: AlignBarProps) => {
    const setX = (x: number) => onChange({ ...position, x: Math.round(x * 10) / 10 });
    const setY = (y: number) => onChange({ ...position, y: Math.round(y * 10) / 10 });

    const alignX = (edge: "left" | "center" | "right") => {
        setX(edge === "left" ? 0 : edge === "right" ? 100 : 50);
    };

    const alignY = (edge: "top" | "middle" | "bottom") => {
        setY(edge === "top" ? 0 : edge === "bottom" ? 100 : 50);
    };

    const nudge = (dx: number, dy: number, e: MouseEvent) => {
        const step = e.shiftKey ? 0.1 : 0.5;
        onChange({
            x: Math.min(100, Math.max(0, Math.round((position.x + dx * step) * 10) / 10)),
            y: Math.min(100, Math.max(0, Math.round((position.y + dy * step) * 10) / 10)),
        } satisfies ElementPosition);
    };

    return (
        <div className="align-bar">
            <span className="align-bar__label">{layoutKey}</span>

            <div className="align-bar__group">
                <button type="button" className="align-bar__btn" onClick={() => alignX("left")} title="Align left">
                    L
                </button>
                <button type="button" className="align-bar__btn" onClick={() => alignX("center")} title="Align center X">
                    CX
                </button>
                <button type="button" className="align-bar__btn" onClick={() => alignX("right")} title="Align right">
                    R
                </button>
            </div>

            <div className="align-bar__group">
                <button type="button" className="align-bar__btn" onClick={() => alignY("top")} title="Align top">
                    T
                </button>
                <button type="button" className="align-bar__btn" onClick={() => alignY("middle")} title="Align middle Y">
                    MY
                </button>
                <button type="button" className="align-bar__btn" onClick={() => alignY("bottom")} title="Align bottom">
                    B
                </button>
            </div>

            <label className="align-bar__field">
                X
                <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={position.x}
                    onChange={(e) => setX(Number(e.target.value))}
                />
            </label>
            <label className="align-bar__field">
                Y
                <input
                    type="number"
                    min={0}
                    max={100}
                    step={0.1}
                    value={position.y}
                    onChange={(e) => setY(Number(e.target.value))}
                />
            </label>

            <div className="align-bar__group">
                <button type="button" className="align-bar__btn" onClick={(e) => nudge(-1, 0, e)} title="Nudge left (Shift=0.1)">
                    ←
                </button>
                <button type="button" className="align-bar__btn" onClick={(e) => nudge(0, -1, e)} title="Nudge up">
                    ↑
                </button>
                <button type="button" className="align-bar__btn" onClick={(e) => nudge(0, 1, e)} title="Nudge down">
                    ↓
                </button>
                <button type="button" className="align-bar__btn" onClick={(e) => nudge(1, 0, e)} title="Nudge right">
                    →
                </button>
            </div>
        </div>
    );
};

export default AlignBar;
