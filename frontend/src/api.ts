import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000",
});

export const setAuthToken = (token: string) => {
  api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

// src/auth.ts
export const saveAuth = (data: any) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const getAuth = () => {
  const data = localStorage.getItem("auth");
  return data ? JSON.parse(data) : null;
};