import { DEFAULT_VARIANT, listVariants } from "@/themes/variants/registry";
import type { VariantSelectProps } from "../../type";

/** `<select>` of every variant registered for a component; unknown values show as default. */
const VariantSelect = ({ componentId, value, onChange }: VariantSelectProps) => {
    const variants = listVariants(componentId);
    const selected = variants.some((v) => v.id === value) ? value : DEFAULT_VARIANT;

    return (
        <select
            className="layout-toolbar__select"
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            aria-label={`${componentId} variant`}
        >
            {variants.map((v) => (
                <option key={v.id} value={v.id}>
                    {v.label}
                </option>
            ))}
        </select>
    );
};

export default VariantSelect;
