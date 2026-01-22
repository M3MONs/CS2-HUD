import { useEffect, useRef } from "react";
import { useHUDStore } from "../stores/HudStore";

export const useGSISocket = () => {
    const { updateState, setConnected } = useHUDStore();
    const socketRef = useRef<WebSocket | null>(null);

    useEffect(() => {
        const connect = () => {
            const ws = new WebSocket(`ws://${window.location.hostname}:8000/ws`);

            ws.onopen = () => setConnected(true);
            ws.onclose = () => {
                setConnected(false);
                setTimeout(connect, 2000);
            };

            ws.onmessage = (event) => {
                const parsed = JSON.parse(event.data);
                if (parsed.map || parsed.player) {
                    updateState(parsed);
                }
            };

            socketRef.current = ws;
        };

        connect();
        return () => socketRef.current?.close();
    }, []);
};
