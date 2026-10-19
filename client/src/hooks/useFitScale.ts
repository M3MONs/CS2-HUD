import { useLayoutEffect, useState } from "react";

type Size = { width: number; height: number };

const contentSize = (el: HTMLElement): Size => {
    const styles = window.getComputedStyle(el);
    const px = (v: string) => Number.parseFloat(v) || 0;
    return {
        width: el.clientWidth - px(styles.paddingLeft) - px(styles.paddingRight),
        height: el.clientHeight - px(styles.paddingTop) - px(styles.paddingBottom),
    };
};

/**
 * Scale factor that fits `target` inside the measured element's content box.
 * Returns a callback ref, so measuring starts whenever the element mounts (also after a loading screen).
 */
export const useFitScale = (target: Size, maxScale = Number.POSITIVE_INFINITY) => {
    const [el, setEl] = useState<HTMLElement | null>(null);
    const [scale, setScale] = useState(1);

    useLayoutEffect(() => {
        if (!el) return;

        const update = () => {
            const box = contentSize(el);
            const next = Math.min(maxScale, box.width / target.width, box.height / target.height);
            setScale(next > 0 ? next : 1);
        };

        update();
        const observer = new ResizeObserver(update);
        observer.observe(el);
        return () => observer.disconnect();
    }, [el, maxScale, target.width, target.height]);

    return [setEl, scale] as const;
};
