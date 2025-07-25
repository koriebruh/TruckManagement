import {jwtDecode} from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  
  useContext,
  
  useEffect,
  useState,
} from "react";
import api from "@/services/axios";
import {  AuthContextProps, RegisterPayload, TokenPayload, User } from "@/types/auth.types";

// ====== Create Context ======
 const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// ====== Provider ======
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // ====== Restore session on mount ======
  useEffect(() => {
    let isMounted = true;

    const restoreSession = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("token");
        const storedUser = await SecureStore.getItemAsync("user");

        if (storedToken && storedUser) {
          api.defaults.headers.common["Authorization"] =
            `Bearer ${storedToken}`;
          const res = await api.get("/auth/validate");

          if (res.status === 200) {
            const parsedUser = JSON.parse(storedUser);
            if (isMounted) {
              setUser(parsedUser);
              setToken(storedToken);
              console.log("✅ Token restored:", storedToken);
              console.log("👤 User restored:", parsedUser);
            }
          }
        }
      } catch (error) {
        console.warn("⚠️ Token invalid or expired, clearing storage");
        await SecureStore.deleteItemAsync("token");
        await SecureStore.deleteItemAsync("user");
        api.defaults.headers.common["Authorization"] = "";
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    restoreSession();
    return () => {
      isMounted = false;
    };
  }, []);

  // ====== Login ======
const login = async (username: string, password: string) => {
  try {
    // Validasi input
    if (!username?.trim() || !password?.trim()) {
      throw new Error("Username dan password tidak boleh kosong.");
    }

    const response = await api.post("/auth/login", {
      username: username.trim(),
      password,
    });

    // Validasi response structure
    if (!response.data) {
      throw new Error("Response data tidak ditemukan.");
    }

    // Coba berbagai struktur response yang mungkin
    let data;
    if (response.data.data) {
      data = response.data.data;
    } else if (response.data.access_token) {
      data = response.data;
    } else {
      throw new Error("Struktur response tidak valid.");
    }

    // Server menggunakan snake_case, bukan camelCase
    const {
      access_token: accessToken,
      refresh_token: refreshToken,
      token_type: tokenType = "Bearer",
    } = data;

    // Validasi tokens
    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("Access token tidak valid.");
    }

    if (!refreshToken || typeof refreshToken !== "string") {
      throw new Error("Refresh token tidak valid.");
    }

    // Decode dan validasi JWT
    let decoded: TokenPayload;
    try {
      decoded = jwtDecode(accessToken);
    } catch (jwtError) {
      throw new Error("Token tidak dapat didecode.");
    }

    // Validasi payload
    if (!decoded.sub) {
      throw new Error("Token payload tidak valid.");
    }

    const userData: User = {
      username: decoded.sub,
    };

    // Simpan tokens dan user data secara parallel
    await Promise.all([
      SecureStore.setItemAsync("token", accessToken),
      SecureStore.setItemAsync("refreshToken", refreshToken),
      SecureStore.setItemAsync("user", JSON.stringify(userData)),
    ]);

    // Set authorization header
    api.defaults.headers.common["Authorization"] =
      `${tokenType} ${accessToken}`;

    // Update state
    setToken(accessToken);
    setUser(userData);

    console.log("✅ Login berhasil");
    console.log("👤 User:", userData);

    return userData; // Return user data untuk kemudahan testing/chaining
  } catch (error: any) {
    console.error("❌ Login gagal:", error);

    // Handle different error types
    let errorMessage = "Login gagal. Silakan coba lagi.";

    if (error.message?.includes("Username dan password")) {
      errorMessage = error.message;
    } else if (error.response?.status === 401) {
      errorMessage = "Username atau password salah.";
    } else if (error.response?.status === 429) {
      errorMessage = "Terlalu banyak percobaan login. Coba lagi nanti.";
    } else if (error.response?.status >= 500) {
      errorMessage = "Server sedang bermasalah. Coba lagi nanti.";
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (!navigator.onLine) {
      errorMessage = "Tidak ada koneksi internet.";
    }

    throw new Error(errorMessage);
  }
};



  // ====== Register ======
  const register = async (payload: RegisterPayload) => {
    try {
      const registerPayload = {
        ...payload,
        role: payload.role || "user",
      };
      await api.post("/auth/register", registerPayload);
      console.log("✅ Registration successful");
    } catch (error: any) {
      console.error("❌ Registration failed:", error);

      let errorMessage = "Registration failed.";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join("\n");
      } else if (error.message) {
        errorMessage = error.message;
      }
      throw new Error(errorMessage);
    }
  };

  // ====== Logout ======
 const logout = async () => {
   setUser(null);
   setToken(null);
   api.defaults.headers.common["Authorization"] = "";

   await SecureStore.deleteItemAsync("token");
   await SecureStore.deleteItemAsync("refreshToken"); // tambahkan ini
   await SecureStore.deleteItemAsync("user");

   console.log("👋 Logged out");
 };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        logout,
      }}>
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
