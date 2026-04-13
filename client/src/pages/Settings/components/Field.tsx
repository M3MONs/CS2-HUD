import type { ReactNode } from "react";

interface FieldProps {
    label: string;
    children: ReactNode;
    className?: string;
}

const Field = ({ label, children, className = "" }: FieldProps) => (
    <label className={`flex flex-col gap-1 ${className}`}>
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">{label}</span>
        {children}
    </label>
);

export default Field;
