import { COMPONENT_LABELS } from "@/themes/variants/registry";
import VariantSelect from "../atoms/VariantSelect";
import type { VariantPickerProps } from "../../type";

/** Appearance picker for the currently selected layout widget. */
const VariantPicker = ({ componentId, value, onChange }: VariantPickerProps) => (
    <div className="align-bar">
        <span className="align-bar__label">{COMPONENT_LABELS[componentId]} look</span>
        <VariantSelect componentId={componentId} value={value} onChange={(id) => onChange(componentId, id)} />
    </div>
);

export default VariantPicker;
