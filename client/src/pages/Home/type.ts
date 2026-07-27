import type { ReactNode } from "react";

export type CardHeaderProps = {
    tag: string;
    accentFrom: string;
    accentTo: string;
    icon: ReactNode;
};

export type CopyButtonProps = {
    url: string;
};

export type GradientBorderProps = {
    accentFrom: string;
    accentTo: string;
};

export type NavCardProps = {
    label: string;
    description: string;
    tag: string;
    path: string;
    accentFrom: string;
    accentTo: string;
    icon: ReactNode;
    copyUrl?: string;
};
