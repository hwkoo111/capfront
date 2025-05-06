// src/api/index.ts
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE as string;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
  headers: { "Content-Type": "application/json" },
});

export default api;
