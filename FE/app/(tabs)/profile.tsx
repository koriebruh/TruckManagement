import React, { useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";
import { useUsers } from "@/hooks/useUser";
import { useFocusEffect, useRouter } from "expo-router";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const { profile, isLoading, isError, error, refetchProfile } = useUsers();
  const router = useRouter();
  console.log({profile});

  useFocusEffect(
    React.useCallback(() => {
      refetchProfile(); 
    }, [])
  );

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Memuat profil...</Text>
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500 text-center">
          {(error as Error)?.message || "Terjadi kesalahan saat memuat profil"}
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 20,
        alignItems: "center",
        backgroundColor: "#f8fafc",
        flexGrow: 1,
      }}>
      {/* Header Section */}
      <View className="mb-8">
        <Text className="text-4xl font-light text-gray-800 text-center mb-2">
          Profil Saya
        </Text>
        <Text className="text-base text-gray-500 text-center font-light">
          Kelola informasi akun Anda
        </Text>
      </View>

      {/* Profile Card */}
      <View className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md mb-6">
        {/* Avatar */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4 shadow-md">
            <Text className="text-white text-3xl font-bold">
              {profile?.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text className="text-2xl font-semibold text-gray-800 mb-1">
            {profile?.username || "Pengguna"}
          </Text>
        </View>

        {/* Info Section */}
        <View className="mb-6">
          <Text className="text-lg font-medium text-gray-700 mb-4">
            Informasi Akun
          </Text>
          <View className="space-y-3">
            <InfoRow  label="Username" value={profile?.username} />
            <InfoRow label="Email" value={profile?.email} />
            <InfoRow label="Telepon" value={profile?.phone_number} />
            <InfoRow
              label="Umur"
              value={profile?.age ? `${profile.age} tahun` : "-"}
            />
          </View>
        </View>

        {/* Actions */}
        <View className="gap-4">
          <TouchableOpacity
            className="bg-blue-600 h-12 rounded-xl justify-center items-center shadow-sm active:bg-blue-700"
            onPress={() => {
              router.push(`/profile/edit/${profile?.id}`);
            }}>
            <Text className="text-white font-semibold text-base">
              Edit Profil
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={logout}
            className="bg-red-500 h-12 rounded-xl justify-center items-center shadow-sm active:bg-red-600">
            <Text className="text-white font-semibold text-base">Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const InfoRow = ({ label, value }: { label: string; value?: string }) => (
  <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
    <Text className="text-gray-600">{label}</Text>
    <Text className="text-gray-800 font-medium">{value || "-"}</Text>
  </View>
);

export default Profile;
