import axios from "axios";

const API_BASE = "http://localhost:5000/api"; //import.meta.env.API_URL;

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
