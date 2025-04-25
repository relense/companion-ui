import axios from "axios";

export const publicAxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_PUBLIC,
  headers: {
    "Content-Type": "application/json",
  },
});

publicAxiosClient.interceptors.request.use((config) => {
  return config;
});

export const clientAxiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL_CLIENT,
  headers: {
    "Content-Type": "application/json",
  },
});

clientAxiosClient.interceptors.request.use((config) => {
  return config;
});
