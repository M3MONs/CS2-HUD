import type { VariantProps } from "@/themes/variants/contracts";
import { BombTimer } from "./BombTimer";
import { DefuseTimer } from "./DefuseTimer";

/** Default `bomb_timer` variant: plant countdown plus defuse countdown. */
export const BombTimers = ({ bomb }: VariantProps["bomb_timer"]) => (
    <>
        <BombTimer key="bomb" bomb={bomb} />
        <DefuseTimer key="defuse" bomb={bomb} />
    </>
);
