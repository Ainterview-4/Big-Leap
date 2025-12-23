import axios, { AxiosError } from "axios";
import { API_URL } from "../config";

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 30000, // 30 second timeout
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers.Authorization = token.startsWith("Bearer ")
        ? token
        : `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.error('❌ Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor with retry logic
api.interceptors.response.use(
  (response) => {
    // Unwrap backend's {success, data, error} structure
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data;
    }
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    // Network error (no response from server)
    if (!error.response) {
      console.error('❌ Network error - server unreachable:', error.message);
      console.error('💡 Check if backend is running at:', API_URL);

      // Retry logic for network errors (max 2 retries)
      if (!originalRequest._retry) {
        originalRequest._retry = 0;
      }

      if (originalRequest._retry < 2) {
        originalRequest._retry++;
        console.log(`⏳ Retrying request (${originalRequest._retry}/2)...`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return api(originalRequest);
      }

      return Promise.reject({
        message: 'Cannot connect to server. Please check your internet connection.',
        code: 'NETWORK_ERROR',
        originalError: error
      });
    }

    // Handle backend error responses
    const errorData = error.response?.data as any;
    if (errorData?.error) {
      const backendError = errorData.error as { code?: string; message?: string };
      error.response.data = {
        message: backendError.message || 'An error occurred',
        code: backendError.code
      };
    }

    // Log errors for debugging
    const status = error.response?.status;
    const url = error.config?.url;

    if (status === 401) {
      console.warn('⚠️  Unauthorized request to:', url);
    } else if (status === 403) {
      console.warn('⚠️  Forbidden request to:', url);
    } else if (status === 404) {
      console.error('❌ Not found:', url);
    } else if (status && status >= 500) {
      console.error('❌ Server error:', status, url);
    }

    return Promise.reject(error);
  }
);

export default api;
