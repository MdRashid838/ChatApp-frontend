import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api"  || "https://your-backend-service.onrender.com/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default API;