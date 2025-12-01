import axios from "axios";
import store from "./store";

const API_BASE = "http://localhost:5000/api"; //import.meta.env.API_URL;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = store.getState().auth.token; // always current
  if (!config.headers) config.headers = {};
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (err) => Promise.reject(err));

export default api;
