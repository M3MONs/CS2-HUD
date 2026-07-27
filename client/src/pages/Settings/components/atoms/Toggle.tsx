import type { ToggleProps } from "../../type";

const Toggle = ({ checked, onChange }: ToggleProps) => (
    <button
        type="button"
        onClick={onChange}
        className={`relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200 ${
            checked ? "bg-orange-500" : "bg-white/10"
        }`}
    >
        <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
                checked ? "translate-x-5" : "translate-x-0"
            }`}
        />
    </button>
);

export default Toggle;
