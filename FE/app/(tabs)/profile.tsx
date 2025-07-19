import { useAuth } from "@/context/AuthContext";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();

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
        {/* Profile Avatar Placeholder */}
        <View className="items-center mb-6">
          <View className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full items-center justify-center mb-4 shadow-md">
            <Text className="text-white text-3xl font-bold">
              {user?.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>

          {/* User Name */}
          <Text className="text-2xl font-semibold text-gray-800 mb-1">
            {user?.username || "Unnamed User"}
          </Text>

          {/* User Email if available */}
          {/* {user?.email && (
            <Text className="text-sm text-gray-500 mb-4">{user.email}</Text>
          )} */}
        </View>

        {/* User Info Section */}
        <View className="mb-6">
          <Text className="text-lg font-medium text-gray-700 mb-4">
            Informasi Akun
          </Text>

          <View className="space-y-3">
            <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
              <Text className="text-gray-600">Username</Text>
              <Text className="text-gray-800 font-medium">
                {user?.username || "-"}
              </Text>
            </View>
{/* 
            {user?.email && (
              <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                <Text className="text-gray-600">Email</Text>
                <Text className="text-gray-800 font-medium">{user.email}</Text>
              </View>
            )}

            {user?.phone_number && (
              <View className="flex-row justify-between items-center py-3 border-b border-gray-100">
                <Text className="text-gray-600">Telepon</Text>
                <Text className="text-gray-800 font-medium">
                  {user.phone_number}
                </Text>
              </View>
            )}

            {user?.age && (
              <View className="flex-row justify-between items-center py-3">
                <Text className="text-gray-600">Umur</Text>
                <Text className="text-gray-800 font-medium">
                  {user.age} tahun
                </Text>
              </View>
            )} */}
          </View>
        </View>

        {/* Action Buttons */}
        <View className="gap-4">
          {/* Edit Profile Button */}
          <TouchableOpacity className="bg-blue-600 h-12 rounded-xl justify-center items-center shadow-sm active:bg-blue-700">
            <Text className="text-white font-semibold text-base">
              Edit Profil
            </Text>
          </TouchableOpacity>

          {/* Logout Button */}
          <TouchableOpacity
            onPress={logout}
            className="bg-red-500 h-12 rounded-xl justify-center items-center shadow-sm active:bg-red-600">
            <Text className="text-white font-semibold text-base">Keluar</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Additional Options */}
      <View className="bg-white rounded-2xl shadow-lg p-6 w-full max-w-md">
        <Text className="text-lg font-medium text-gray-700 mb-4">
          Pengaturan
        </Text>

        <View className="space-y-3">
          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Notifikasi</Text>
            <Text className="text-blue-600 font-medium">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Keamanan</Text>
            <Text className="text-blue-600 font-medium">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center py-3 border-b border-gray-100">
            <Text className="text-gray-600">Privasi</Text>
            <Text className="text-blue-600 font-medium">›</Text>
          </TouchableOpacity>

          <TouchableOpacity className="flex-row justify-between items-center py-3">
            <Text className="text-gray-600">Bantuan</Text>
            <Text className="text-blue-600 font-medium">›</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
