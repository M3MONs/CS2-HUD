import { AnimatePresence, motion } from "framer-motion";
import ThemeStyleFields from "@/components/ThemeStyleFields";
import type { StyleModalProps } from "../../type";

const StyleModal = ({ open, style, onStyleChange, onSave, onCancel, onReset }: StyleModalProps) => (
    <AnimatePresence>
        {open && (
            <motion.div
                className="style-modal__backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onCancel}
            >
                <motion.div
                    className="style-modal__panel"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="mb-4 flex items-center justify-between gap-3">
                        <h2 className="text-base font-semibold text-white">Theme colors</h2>
                        <button
                            type="button"
                            onClick={onReset}
                            className="rounded-md px-2 py-1 text-xs text-white/40 transition hover:bg-white/10 hover:text-white/70"
                        >
                            Reset style
                        </button>
                    </div>

                    <ThemeStyleFields value={style} onChange={onStyleChange} />

                    <div className="mt-5 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            className="rounded-md px-4 py-1.5 text-sm text-white/40 transition hover:text-white/70"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={onSave}
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

export default StyleModal;
