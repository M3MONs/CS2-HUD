import { type AxiosResponse } from "axios";
import type { HudConfig, HudTheme } from "@/types/hudConfig";
import api from "@/api/apiManager";

export const apiConfig = {
    get: (): Promise<AxiosResponse<HudConfig>> => api.get<HudConfig>("/config/"),

    update: (config: HudConfig): Promise<AxiosResponse<HudConfig>> => api.put<HudConfig>("/config/", config),

    patch: (partial: Partial<HudConfig>): Promise<AxiosResponse<HudConfig>> =>
        api.patch<HudConfig>("/config/", partial),

    addTheme: (theme: HudTheme): Promise<AxiosResponse<HudConfig>> => api.post<HudConfig>("/config/themes", theme),

    updateTheme: (themeId: string, theme: HudTheme): Promise<AxiosResponse<HudConfig>> =>
        api.put<HudConfig>(`/config/themes/${themeId}`, theme),

    deleteTheme: (themeId: string): Promise<AxiosResponse<HudConfig>> =>
        api.delete<HudConfig>(`/config/themes/${themeId}`),
};
