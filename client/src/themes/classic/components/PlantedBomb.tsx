import type { PlantedBombProps } from "../types";

export const PlantedBomb = ({ x, y, vw, vh }: PlantedBombProps) => {
    const px = (x / 100) * vw - 5;
    const py = (y / 100) * vh - 5;
    return (
        <div
            className="classic-radar__planted-bomb"
            style={{ transform: `translate(${px}px, ${py}px) rotate(45deg)` }}
            title="Bomb"
        />
    );
};
