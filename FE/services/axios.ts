import axios, {
  AxiosError,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import * as SecureStore from "expo-secure-store";

const BASE_URL = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

// Token storage keys
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

// Store for refresh token promise to prevent multiple simultaneous refresh calls
let refresh_tokenPromise: Promise<string | null> | null = null;

// Helper to get timestamp for logs
const getTimestamp = () => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour12: false });
};

// Helper to get token prefix for logging (first 20 chars)
const getTokenPrefix = (token: string) => {
  return token.length > 20 ? `${token.substring(0, 20)}...` : token;
};

// Create axios instance
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// =======================
// REQUEST INTERCEPTOR
// =======================
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const access_token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (access_token && config.headers) {
        config.headers.Authorization = `Bearer ${access_token}`;
      }
    } catch (error) {
      console.error("❌ Error getting access token:", error);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// =======================
// RESPONSE INTERCEPTOR
// =======================
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      console.log(`[${getTimestamp()}] ⚠️ [TOKEN REFRESH] 401 Unauthorized detected, attempting token refresh...`);

      try {
        if (refresh_tokenPromise) {
          console.log(`[${getTimestamp()}] 🔄 [TOKEN REFRESH] Refresh already in progress, waiting...`);
          const newToken = await refresh_tokenPromise;
          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log(`[${getTimestamp()}] ✅ [TOKEN REFRESH] Retry with refreshed token successful`);
            return api(originalRequest);
          }
        } else {
          console.log(`[${getTimestamp()}] 🔄 [TOKEN REFRESH] Starting refresh process...`);
          refresh_tokenPromise = refreshAccessToken();
          const newToken = await refresh_tokenPromise;
          refresh_tokenPromise = null;

          if (newToken && originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            console.log(`[${getTimestamp()}] ↩️ [TOKEN REFRESH] Retrying original request with new token`);
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error(`[${getTimestamp()}] ❌ [TOKEN REFRESH] Failed:`, refreshError);
        await clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// =======================
// REFRESH TOKEN FUNCTION
// =======================
const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refresh_token = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);

    if (!refresh_token) {
      console.warn(`[${getTimestamp()}] ⚠️ [TOKEN REFRESH] No refresh token available`);
      return null;
    }

    console.log(`[${getTimestamp()}] 🔄 [TOKEN REFRESH] Current refresh token: ${getTokenPrefix(refresh_token)}`);
    console.log(`[${getTimestamp()}] 📡 [TOKEN REFRESH] Request: POST /auth/refresh-token`);

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

    // ✅ Ambil token dari nested data
    const access_token = response.data?.data?.access_token || null;
    const newrefresh_token =
      response.data?.data?.refresh_token || refresh_token;

    console.log(`[${getTimestamp()}] 🔑 [TOKEN REFRESH] Response:`, response.data);

    // Simpan hanya jika string
    if (access_token && typeof access_token === "string") {
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, access_token);
      console.log(`[${getTimestamp()}] ✅ [TOKEN REFRESH] New access token stored: ${getTokenPrefix(access_token)}`);
    }
    if (newrefresh_token && typeof newrefresh_token === "string") {
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newrefresh_token);
      if (newrefresh_token !== refresh_token) {
        console.log(`[${getTimestamp()}] 🔄 [TOKEN REFRESH] Token rotated!`);
        console.log(`[${getTimestamp()}]    Old: ${getTokenPrefix(refresh_token)}`);
        console.log(`[${getTimestamp()}]    New: ${getTokenPrefix(newrefresh_token)}`);
      } else {
        console.log(`[${getTimestamp()}] ℹ️ [TOKEN REFRESH] Refresh token unchanged`);
      }
    }

    console.log(`[${getTimestamp()}] ✅ [TOKEN REFRESH] Success! Tokens refreshed at ${getTimestamp()}`);
    return access_token;
  } catch (error) {
    console.error(`[${getTimestamp()}] ❌ [TOKEN REFRESH] Failed:`, error);
    await clearTokens();
    return null;
  }
};


// =======================
// CLEAR TOKENS
// =======================
const clearTokens = async (): Promise<void> => {
  try {
    await Promise.all([
      SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY),
      SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY),
      SecureStore.deleteItemAsync("user"),
    ]);
    console.log(`[${getTimestamp()}] 🗑️ [TOKEN CLEAR] All tokens cleared`);
  } catch (error) {
    console.error(`[${getTimestamp()}] ❌ [TOKEN CLEAR] Error:`, error);
  }
};

export { refreshAccessToken, clearTokens, ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY };
export default api;
