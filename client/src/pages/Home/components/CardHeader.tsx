import { motion } from "framer-motion";

type CardHeaderProps = {
    tag: string;
    accentFrom: string;
    accentTo: string;
    icon: React.ReactNode;
};

const CardHeader = ({ tag, accentFrom, accentTo, icon }: CardHeaderProps) => (
    <div className="mb-3 flex items-center justify-between">
        <span className={`rounded-full bg-gradient-to-br ${accentFrom} ${accentTo} px-3 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg`}>
            {tag}
        </span>
        <motion.span
            variants={{ hovered: { x: 4, opacity: 1 } }}
            initial={{ opacity: 0.3 }}
            transition={{ duration: 0.25 }}
            className="text-white/30"
        >
            {icon}
        </motion.span>
    </div>
);

export default CardHeader;
