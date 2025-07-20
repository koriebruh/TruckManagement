import api from "@/services/axios";
import { ProfileResponse, UpdatePasswordPayload, UpdateProfilePayload, UserAvailableResponse, UserResponse } from "@/types/user.types";
import { useEffect, useState } from "react";

export function useUsers() {
  const [profile, setProfile] = useState<ProfileResponse | null>(null);
  const [availableUsers, setAvailableUsers] = useState<UserAvailableResponse[]>(
    []
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const { data } = await api.get("/api/users/profile");
      setProfile(data.data);
      setError(null);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (payload: UpdateProfilePayload) => {
    try {
      const { data } = await api.post("/api/users/profile", payload);
      setProfile(data.data);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const updatePassword = async (payload: UpdatePasswordPayload) => {
    try {
      const { data } = await api.patch("/api/users/profile/password", payload);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const { data } = await api.get("/api/users/available");
      setAvailableUsers(data.data);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  const fetchUserById = async (userId: string): Promise<UserResponse> => {
    try {
      const { data } = await api.get(`/api/users/${userId}`);
      return data.data;
    } catch (err: any) {
      throw new Error(err.message);
    }
  };

  useEffect(() => {
    fetchProfile(); // otomatis fetch profile saat hook dipakai
  }, []);

  return {
    profile,
    availableUsers,
    loading,
    error,
    fetchProfile,
    updateProfile,
    updatePassword,
    fetchAvailableUsers,
    fetchUserById,
  };
}
