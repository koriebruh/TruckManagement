import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/services/axios";
import {
  ProfileResponse,
  UpdatePasswordPayload,
  UpdateProfilePayload,
  UserAvailableResponse,
  UserResponse,
} from "@/types/user.types";

// Fetch profile user
const fetchProfile = async (): Promise<ProfileResponse> => {
  const { data } = await api.get("/api/users/profile");
  return data.data;
};

// Update profile user
const updateProfileRequest = async (
  payload: UpdateProfilePayload
): Promise<ProfileResponse> => {
  const { data } = await api.post("/api/users/profile", payload);
  return data.data;
};

// Update password
const updatePasswordRequest = async (
  payload: UpdatePasswordPayload
): Promise<any> => {
  const { data } = await api.patch("/api/users/profile/password", payload);
  return data.data;
};

// Fetch user by ID
const fetchUserById = async (userId: string): Promise<UserResponse> => {
  const { data } = await api.get(`/api/users/${userId}`);
  return data.data;
};

// Fetch all available users
const fetchAvailableUsers = async (): Promise<UserAvailableResponse[]> => {
  const { data } = await api.get("/api/users/available");
  return data.data;
};

export function useUsers() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading,
    isError,
    refetch: refetchProfile,
    error,
  } = useQuery<ProfileResponse>({
    queryKey: ["profile"],
    queryFn: fetchProfile,
  });

  const { data: availableUsers, refetch: refetchAvailableUsers } = useQuery<
    UserAvailableResponse[]
  >({
    queryKey: ["availableUsers"],
    queryFn: fetchAvailableUsers,
  });

  const updateProfile = useMutation({
    mutationFn: updateProfileRequest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["profile"] });
    },
  });

  const updatePassword = useMutation({
    mutationFn: updatePasswordRequest,
  });

  return {
    profile,
    availableUsers,
    isLoading,
    isError,
    error,
    refetchProfile,
    refetchAvailableUsers,
    updateProfile: updateProfile.mutateAsync,
    updatePassword: updatePassword.mutateAsync,
    fetchUserById,
  };
}
