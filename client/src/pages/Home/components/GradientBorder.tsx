import { motion } from "framer-motion";

type GradientBorderProps = {
    accentFrom: string;
    accentTo: string;
};

const GradientBorder = ({ accentFrom, accentTo }: GradientBorderProps) => (
    <motion.span
        variants={{ hovered: { opacity: 1 } }}
        initial={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${accentFrom} ${accentTo} opacity-0`}
    />
);

export default GradientBorder;
