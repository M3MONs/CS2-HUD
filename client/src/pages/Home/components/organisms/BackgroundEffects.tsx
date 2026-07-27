const BackgroundEffects = () => (
    <>
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
            <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-orange-600/10 blur-[120px]" />
            <div className="absolute -bottom-32 -right-32 h-[500px] w-[500px] rounded-full bg-sky-600/10 blur-[120px]" />
        </div>
        <div
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
                backgroundImage: "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
            }}
        />
    </>
);

export default BackgroundEffects;
