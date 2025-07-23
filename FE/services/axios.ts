import axios from "axios";
import * as SecureStore from "expo-secure-store";

const apiUrl = process.env.EXPO_PUBLIC_API_URL;

const api = axios.create({
  baseURL: apiUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

// ====== Interceptor: Tambah token sebelum request dikirim ======
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ====== Interceptor: Cek error response (refresh token jika perlu) ======
api.interceptors.response.use(
  (response) => {
    console.log("✅ API Success:", response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error("❌ API Error:", error.config?.url, error.response?.status);

    const originalRequest = error.config;

    // Tangani token expired
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refreshToken");

        if (!refreshToken) throw new Error("No refresh token stored.");

        const refreshResponse = await axios.post(
          `${apiUrl}/auth/refresh-token`,
          {
            refreshToken,
          }
        );

        const { accessToken, tokenType } = refreshResponse.data.data;

        // Simpan access token baru
        await SecureStore.setItemAsync("token", accessToken);

        // Set header untuk request selanjutnya
        api.defaults.headers.common["Authorization"] =
          `${tokenType} ${accessToken}`;
        originalRequest.headers["Authorization"] =
          `${tokenType} ${accessToken}`;

        return api(originalRequest); // Ulangi request yang gagal
      } catch (refreshError) {
        console.error("❌ Refresh token gagal:", refreshError);

        // Hapus token-token yang tersimpan
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("refreshToken");
        await SecureStore.deleteItemAsync("user");

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
