import axios from "axios";

// Environment variable se API URL read karega, fallback me Render URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://chatapp-backend-191n.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;