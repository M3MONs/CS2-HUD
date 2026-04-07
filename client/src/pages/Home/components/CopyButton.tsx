import { useState } from "react";
import { CheckIcon, CopyIcon } from "./icons";

type CopyButtonProps = {
    url: string;
};

const CopyButton = ({ url }: CopyButtonProps) => {
    const [copied, setCopied] = useState(false);

    const handleClick = async (e: React.MouseEvent) => {
        e.stopPropagation();
        await navigator.clipboard.writeText(`${window.location.origin}${url}`);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const baseClass = "flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs transition-all duration-200";
    const idleClass = "border-white/10 bg-white/5 text-white/40 hover:border-orange-500/30 hover:bg-orange-500/10 hover:text-orange-300";
    const copiedClass = "border-green-500/30 bg-green-500/10 text-green-400";

    return (
        <button
            onClick={handleClick}
            className={`${baseClass} ${copied ? copiedClass : idleClass}`}
        >
            {copied ? <CheckIcon /> : <CopyIcon />}
            {copied ? "Copied!" : "Copy OBS Link"}
        </button>
    );
};

export default CopyButton;
