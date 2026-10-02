import axios from "axios";
import type { MediaUploadResponse } from "./types";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

// Interceptor para adicionar token
api.interceptors.request.use((config) => {
  const auth = localStorage.getItem("auth");
  if (auth) {
    const { access_token } = JSON.parse(auth);
    config.headers.Authorization = `Bearer ${access_token}`;
  }
  return config;
});

// Interceptor para tratar erros e renovar token
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Se for erro 401 e ainda não tentamos renovar
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const auth = localStorage.getItem("auth");
        if (auth) {
          const { refresh_token } = JSON.parse(auth);
          const response = await axios.post(`${API_URL}/auth/refresh`, {
            refreshToken: refresh_token,
          });

          const newAuth = {
            ...JSON.parse(auth),
            access_token: response.data.access_token,
            refresh_token: response.data.refresh_token,
          };

          localStorage.setItem("auth", JSON.stringify(newAuth));
          api.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${response.data.access_token}`;

          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("auth");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// Arquivos enviados ao backend vêm como caminho relativo (/uploads/...)
export const mediaUrl = (url?: string | null) => {
  if (!url) return "";
  return url.startsWith("/") ? `${API_URL}${url}` : url;
};

export const uploadMedia = async (file: File) => {
  const form = new FormData();
  form.append("file", file);

  const res = await api.post<MediaUploadResponse>("/media/upload", form, {
    timeout: 120000,
  });

  return res.data;
};

export const getErrorMessage = (error: unknown, fallback: string) => {
  if (axios.isAxiosError(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join("\n");
    if (typeof message === "string") return message;
  }
  return fallback;
};
