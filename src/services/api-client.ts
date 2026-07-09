import axios from "axios";

const browserApiBase = import.meta.env.VITE_API_BASE_URL ?? "/api";

export const apiClient = axios.create({
  baseURL: browserApiBase,
  timeout: 8000,
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (!config || config.__retryCount >= 2) return Promise.reject(error);
    config.__retryCount = (config.__retryCount ?? 0) + 1;
    await new Promise((resolve) => setTimeout(resolve, 450 * config.__retryCount));
    return apiClient(config);
  }
);
