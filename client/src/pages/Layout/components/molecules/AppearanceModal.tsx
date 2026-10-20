import { AnimatePresence, motion } from "framer-motion";
import type { HudComponentId } from "@/types/hudConfig";
import { COMPONENT_LABELS } from "@/themes/variants/registry";
import VariantSelect from "../atoms/VariantSelect";
import type { AppearanceModalProps } from "../../type";

const COMPONENT_IDS = Object.keys(COMPONENT_LABELS) as HudComponentId[];

const AppearanceModal = ({ open, variants, onChange, onDone }: AppearanceModalProps) => (
    <AnimatePresence>
        {open && (
            <motion.div
                className="style-modal__backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onDone}
            >
                <motion.div
                    className="style-modal__panel"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="mb-4 text-base font-semibold text-white">Appearance</h2>

                    <div className="flex flex-col gap-3">
                        {COMPONENT_IDS.map((id) => (
                            <label key={id} className="flex items-center justify-between gap-4 text-sm text-white/80">
                                {COMPONENT_LABELS[id]}
                                <VariantSelect
                                    componentId={id}
                                    value={variants[id]}
                                    onChange={(variantId) => onChange(id, variantId)}
                                />
                            </label>
                        ))}
                    </div>

                    <div className="mt-5 flex justify-end">
                        <button
                            type="button"
                            onClick={onDone}
                            className="rounded-md bg-orange-500 px-5 py-1.5 text-sm font-medium text-white transition hover:bg-orange-400"
                        >
                            Done
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
);

export default AppearanceModal;
