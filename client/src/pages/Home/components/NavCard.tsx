import { motion } from "framer-motion";
import { useNavigate } from "react-router";
import { fadeUp } from "./variants";
import CopyButton from "./CopyButton";
import GradientBorder from "./GradientBorder";
import CardHeader from "./CardHeader";

type NavCardProps = {
    label: string;
    description: string;
    tag: string;
    path: string;
    accentFrom: string;
    accentTo: string;
    icon: React.ReactNode;
    copyUrl?: string;
};

const NavCard = ({ label, description, tag, path, accentFrom, accentTo, icon, copyUrl }: NavCardProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            variants={fadeUp}
            whileHover="hovered"
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate(path)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && navigate(path)}
            className="group relative w-full cursor-pointer overflow-hidden rounded-2xl border border-white/10 bg-white/[0.04] p-px text-left focus:outline-none"
        >
            <GradientBorder accentFrom={accentFrom} accentTo={accentTo} />

            <div className="relative z-10 rounded-[15px] bg-neutral-950 px-7 py-6 transition-colors duration-300 group-hover:bg-neutral-900/80">
                <CardHeader tag={tag} accentFrom={accentFrom} accentTo={accentTo} icon={icon} />

                <h2 className="text-2xl font-bold tracking-tight text-white">{label}</h2>
                <p className="mt-1 text-sm leading-relaxed text-white/50">{description}</p>

                {copyUrl && (
                    <div className="mt-4" onClick={(e) => e.stopPropagation()}>
                        <CopyButton url={copyUrl} />
                    </div>
                )}
            </div>
        </motion.div>
    );
};

export default NavCard;

