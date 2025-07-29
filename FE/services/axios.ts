// services/api.ts
import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Store for refresh token promise to prevent multiple simultaneous refresh calls
let refresh_tokenPromise: Promise<string | null> | null = null;

// Request interceptor to add access token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const access_token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (access_token && config.headers) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    } catch (error) {
      console.error("Error getting access token:", error);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Check if error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // If there's already a refresh in progress, wait for it
        if (refresh_tokenPromise) {
          const newaccess_token = await refresh_tokenPromise;
          if (newaccess_token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newaccess_token}`;
            return api(originalRequest);
          }
        } else {
          // Start a new refresh token process
          refresh_tokenPromise = refreshAccessToken();
          const newaccess_token = await refresh_tokenPromise;
          refresh_tokenPromise = null;

          if (newaccess_token && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newaccess_token}`;
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        // Clear tokens and redirect to login
        await clearTokens();
        // You might want to emit an event here to redirect to login
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// Refresh token function
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    if (!refresh_token) {
      throw new Error("No refresh token available");
    }

    // Create a new axios instance without interceptors to avoid infinite loops
    const refreshApi = axios.create({
      baseURL: BASE_URL,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
    });

    const response = await refreshApi.post("/auth/refresh-token", {
      refresh_token,
    });

    const {
      access_token,
      refresh_token: newrefresh_token,
      tokenType,
    } = response.data;

    // Store new tokens
    await Promise.all([
      SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token),
      SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newrefresh_token),
    ]);

    console.log("✅ Tokens refreshed successfully");
    return access_token;
  } catch (error) {
    console.error("❌ Token refresh failed:", error);
    await clearTokens();
    throw error;
  }
};

// Clear all tokens
const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync("user"),
    ]);
    console.log("🗑️ Tokens cleared");
  } catch (error) {
    console.error("Error clearing tokens:", error);
  }
};

// Export functions for external use
export { refreshAccessToken, clearTokens, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
export default api;
