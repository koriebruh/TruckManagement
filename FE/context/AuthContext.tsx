import axios from "axios";
import {jwtDecode} from "jwt-decode";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from "react";

// ✅ Ganti IP address ini dengan IP lokal backend kamu
const API_URL = "http://192.168.0.110:8080";

// ====== Interfaces ======
interface User {
  // id: string;
  username: string;
  // email: string;
  // role: string;
  // phoneNumber: string;
  // age: number;
}

interface RegisterPayload {
  username?: string;
  email?: string;
  password?: string;
  role?: string;
  phoneNumber?: string;
  age?: number;
}

interface AuthContextProps {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
}
interface TokenPayload {
  sub: string; // username dari JWT
  
}

// ====== Create Context ======
const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// ====== Axios Instance ======
const api = axios.create({
  baseURL: API_URL,
});

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
    const response = await api.post("/auth/login", { username, password });
    const data = response.data?.data;

    const { access_token: accessToken, token_type: tokenType } = data;

    if (!accessToken || typeof accessToken !== "string") {
      throw new Error("Access token is invalid.");
    }

    const decoded: TokenPayload = jwtDecode(accessToken);

    const userData: User = {
     
      username: decoded.sub,
    
    };

    await SecureStore.setItemAsync("token", accessToken);
    await SecureStore.setItemAsync("user", JSON.stringify(userData));

    api.defaults.headers.common["Authorization"] =
      `${tokenType} ${accessToken}`;
    setToken(accessToken);
    setUser(userData);


    console.log("✅ Login successful");
    console.log("👤 User:", userData);
  } catch (error: any) {
    console.error("❌ Login failed:", error);

    let errorMessage = "Login failed.";
    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
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

// ====== Hook ======
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
