import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api/",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// attach the access token
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ► refresh on 401 and retry once
let isRefreshing = false;
API.interceptors.response.use(
  (r) => r,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry &&
      localStorage.getItem("refresh_token")
    ) {
      original._retry = true;
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await API.post("auth/refresh/", {
            refresh: localStorage.getItem("refresh_token"),
          });
          localStorage.setItem("access_token", data.access);
        } finally {
          isRefreshing = false;
        }
      }
      original.headers.Authorization = `Bearer ${localStorage.getItem(
        "access_token"
      )}`;
      return API(original);
    }
    return Promise.reject(error);
  }
);

export default API;
