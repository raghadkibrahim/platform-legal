import axios from "axios";

const base = import.meta.env.VITE_API_BASE_URL;
if (!base) {
  // Hard fail early so we don't mask the issue
  throw new Error("VITE_API_BASE_URL is not set");
}

export const api = axios.create({
  baseURL: base + "/api/v1",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Temporary: log Axios errors with details
api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("AXIOS ERROR", {
      msg: err?.message,
      code: err?.code,
      url: err?.config?.url,
      method: err?.config?.method,
      status: err?.response?.status,
      data: err?.response?.data,
    });
    return Promise.reject(err);
  }
);
