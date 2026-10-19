import { useState, type InputHTMLAttributes } from "react";

type NumberFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "value" | "onChange"> & {
    value: number;
    onCommit: (value: number) => void;
};

/**
 * Number input that keeps the raw text while editing, so clearing the field
 * to retype doesn't commit 0. Only valid numbers are committed; blur restores `value`.
 */
const NumberField = ({ value, onCommit, onBlur, ...inputProps }: NumberFieldProps) => {
    const [draft, setDraft] = useState<string | null>(null);

    return (
        <input
            {...inputProps}
            type="number"
            value={draft ?? String(value)}
            onChange={(e) => {
                setDraft(e.target.value);
                const next = e.target.valueAsNumber;
                if (Number.isFinite(next)) onCommit(next);
            }}
            onBlur={(e) => {
                setDraft(null);
                onBlur?.(e);
            }}
        />
    );
};

export default NumberField;
