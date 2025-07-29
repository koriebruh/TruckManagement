import { useState, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { LoginRequest, RegisterRequest } from "@/types/auth.types";
import { refreshAccessToken } from "@/services/axios";
import {  useRouter } from "expo-router";

export const useLogin = () => {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleLogin = useCallback(
    async (credentials: LoginRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const payload = {
          username: credentials.username,
          password: credentials.password,
        };
        await login(payload);
        router.push("/(tabs)"); 
      } catch (err: any) {
        setError(err.message || "Login failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [login]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleLogin,
    isLoading,
    error,
    clearError,
  };
};

export const useRegister = () => {
  const { register } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = useCallback(
    async (userData: RegisterRequest) => {
      try {
        setIsLoading(true);
        setError(null);
        const payload = {
          username: userData.username,
          password: userData.password,
          email: userData.email,
          phone_number: userData.phone_number,
          age: userData.age,
        };
        await register(payload);
      } catch (err: any) {
        setError(err.message || "Registration failed");
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [register]
  );

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    handleRegister,
    isLoading,
    error,
    clearError,
  };
};

export const useLogout = () => {
  const { logout } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLoading(true);
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [logout]);

  return {
    handleLogout,
    isLoading,
  };
};

export const useTokenRefresh = () => {
  const { refreshaccess_token } = useAuth();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshToken = useCallback(async () => {
    try {
      setIsRefreshing(true);
      const newToken = await refreshaccess_token();
      return newToken;
    } catch (error) {
      console.error("Token refresh error:", error);
      return null;
    } finally {
      setIsRefreshing(false);
    }
  }, [refreshaccess_token]);

  return {
    handleRefreshToken,
    isRefreshing,
  };
};

export const useAuthStatus = () => {
  const { isAuthenticated, loading, user, access_token } = useAuth();

  return {
    isAuthenticated,
    isLoading: loading,
    user,
    hasValidToken: !!access_token,
  };
};
