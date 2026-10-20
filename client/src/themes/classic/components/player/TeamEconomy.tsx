import type { VariantProps } from "@/themes/variants/contracts";

/** Per-player money line. Sizes/colors come from the CSS variables set by the player card. */
export const TeamEconomy = ({ player }: VariantProps["team_economy"]) => (
    <div className="classic-player__money">${player.state.money}</div>
);
