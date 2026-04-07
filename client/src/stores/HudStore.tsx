import { create } from 'zustand';
import { type GSIPayload } from '@/types/gsi';

interface HUDState {
    data: GSIPayload | null;
    isConnected: boolean;
    updateState: (newData: GSIPayload) => void;
    setConnected: (status: boolean) => void;
}

export const useHUDStore = create<HUDState>((set) => ({
    data: null,
    isConnected: false,
    setConnected: (status) => set({ isConnected: status }),
    updateState: (newData) => set({ data: newData }),
}));