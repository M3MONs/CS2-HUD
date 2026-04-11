import axios, { type AxiosInstance } from "axios";

const api: AxiosInstance = axios.create({
    baseURL: "/api",
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 5000,
});

export default api;
