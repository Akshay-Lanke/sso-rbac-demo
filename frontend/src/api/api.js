// Example helper for centralizing axios config (optional)
import axios from "axios";
const API_URL = "http://localhost:3000";
axios.defaults.withCredentials = true;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true
});
