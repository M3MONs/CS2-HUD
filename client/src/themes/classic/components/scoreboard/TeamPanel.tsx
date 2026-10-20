const TeamPanel = ({
    side,
    name,
    score,
    grad,
    glow,
}: {
    side: "ct" | "t";
    name: string;
    score: number;
    grad: string;
    glow: string;
}) => (
    <div
        className={`classic-scoreboard__team classic-scoreboard__team--${side}`}
        style={{
            "--c-team-bg": grad,
            "--c-team-shadow": `0 4px 16px ${glow}`,
        } as React.CSSProperties}
    >
        <span className="classic-scoreboard__team-label">
            {side.toUpperCase()}
        </span>
        <span className="classic-scoreboard__team-name">
            {name || side.toUpperCase()}
        </span>
        <span className="classic-scoreboard__score">{score}</span>
    </div>
);

export default TeamPanel;
