import { motion } from "framer-motion";
import BackgroundEffects from "./components/organisms/BackgroundEffects";
import NavCard from "./components/organisms/NavCard";
import { HudIcon, LayoutIcon, SettingsIcon } from "./components/atoms/icons";
import { container, fadeUp } from "./variants";
import "./style.css";

const HomePage = () => {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-neutral-950 px-6">
            <BackgroundEffects />

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="relative z-10 flex w-full max-w-lg flex-col gap-5"
            >
                <motion.div variants={fadeUp} className="mb-2">
                    <h1 className="text-6xl font-extrabold leading-none tracking-tight text-white">
                        CS2{" "}
                        <span className="bg-gradient-to-r from-orange-400 to-amber-300 bg-clip-text text-transparent">
                            HUD
                        </span>
                    </h1>
                </motion.div>

                <motion.div
                    variants={fadeUp}
                    className="h-px w-full bg-gradient-to-r from-transparent via-white/15 to-transparent"
                />

                <NavCard
                    label="HUD Overlay"
                    description="Open the real-time in-game overlay powered by live GSI data."
                    tag="Live"
                    path="/hud"
                    accentFrom="from-orange-500/40"
                    accentTo="to-amber-400/20"
                    icon={<HudIcon />}
                    copyUrl="/hud"
                />
                <NavCard
                    label="Layout Editor"
                    description="Drag HUD widgets and tweak theme colors with a live preview."
                    tag="Edit"
                    path="/layout"
                    accentFrom="from-violet-500/40"
                    accentTo="to-fuchsia-400/20"
                    icon={<LayoutIcon />}
                />
                <NavCard
                    label="Settings"
                    description="Configure visibility, colors, and integration options."
                    tag="Config"
                    path="/settings"
                    accentFrom="from-sky-500/40"
                    accentTo="to-cyan-400/20"
                    icon={<SettingsIcon />}
                />

                <motion.p variants={fadeUp} className="pt-1 text-center text-[11px] text-white/20">
                    GSI · WebSocket · React
                </motion.p>
            </motion.div>
        </div>
    );
};

export default HomePage;
