import type { FieldProps } from "../../type";

const Field = ({ label, children, className = "" }: FieldProps) => (
    <label className={`flex flex-col gap-1 ${className}`}>
        <span className="text-[11px] font-medium uppercase tracking-wider text-white/30">{label}</span>
        {children}
    </label>
);

export default Field;
