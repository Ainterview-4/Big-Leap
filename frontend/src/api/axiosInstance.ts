import axios from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = token.startsWith("Bearer ")
      ? token
      : `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to unwrap backend's {success, data, error} structure
api.interceptors.response.use(
  (response) => {
    // Backend returns: {success: true, data: {...}}
    // We want to return just the inner data object
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  (error) => {
    // Handle error responses
    if (error.response?.data?.error) {
      // Backend error format: {success: false, error: {code, message}}
      const backendError = error.response.data.error;
      error.response.data = {
        message: backendError.message || 'An error occurred',
        code: backendError.code
      };
    }
    return Promise.reject(error);
  }
);

export default api;
