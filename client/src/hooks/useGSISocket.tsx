import { useEffect, useRef, useCallback } from "react";
import { useHUDStore } from "@/stores/HudStore";

export const useGSISocket = () => {
    const updateState = useHUDStore((s) => s.updateState);
    const setConnected = useHUDStore((s) => s.setConnected);

    const updateStateRef = useRef(updateState);
    const setConnectedRef = useRef(setConnected);

    useEffect(() => {
        updateStateRef.current = updateState;
    }, [updateState]);
    
    useEffect(() => {
        setConnectedRef.current = setConnected;
    }, [setConnected]);

    const connect = useCallback(() => {
        const ws = new WebSocket(`ws://${window.location.host}/ws`);
        socketRef.current = ws;

        ws.onopen = () => setConnectedRef.current(true);

        ws.onclose = () => {
            setConnectedRef.current(false);
            reconnectTimerRef.current = window.setTimeout(connect, 2000);
        };

        ws.onerror = (err) => {
            console.error("[GSI] WebSocket error:", err);
            ws.close();
        };

        ws.onmessage = (event) => {
            try {
                const parsed = JSON.parse(event.data);
                if (parsed?.map || parsed?.player) {
                    updateStateRef.current(parsed);
                }
            } catch (err) {
                console.warn("[GSI] Failed to parse message:", err);
            }
        };
    }, []);

    const socketRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<number | null>(null);

    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
            }
            socketRef.current?.close();
        };
    }, [connect]);
};
