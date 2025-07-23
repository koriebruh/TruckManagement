import api from "@/services/axios";
import { AuthContextProps, RegisterPayload, TokenPayload, User } from "@/types/auth.types";
import * as SecureStore from "expo-secure-store";
import { jwtDecode } from "jwt-decode";
import React, {
  createContext,
  ReactNode,

  useContext,

  useEffect,
  useState,
} from "react";

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
    console.error("❌ Login gagal:", error.response?.data.errors.password || error.message);

      throw error.response?.data?.errors.password
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
      console.log("❌ Registration failed:", error.response.data.errors);
      throw error.response?.data?.errors;
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
