import axios from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor: attach Clerk JWT
api.interceptors.request.use(async (config) => {
  try {
    if (typeof window !== "undefined") {
      // @ts-expect-error Clerk global
      const token = await window.Clerk?.session?.getToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }
  } catch {
    // No token available, proceed unauthenticated
  }
  return config;
});

// Response interceptor: unwrap data
api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const status = err.response?.status;
    if (status === 401 && typeof window !== "undefined") {
      window.location.href = "/sign-in";
    }
    return Promise.reject(err.response?.data ?? { error: "Network error" });
  }
);

export default api;
