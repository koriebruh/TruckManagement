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
        paddingHorizontal: 16,
        alignItems: "center",
        backgroundColor: "#f9fafb", 
        flexGrow: 1,
      }}>
      <View className="items-center p-6 bg-white rounded-2xl shadow-lg w-full max-w-sm">
        {/* User Name */}
        <Text className="text-2xl font-semibold text-gray-800 mb-1">
          {user?.username || "Unnamed User"}
        </Text>


        {/* Logout Button */}
        <TouchableOpacity
          onPress={logout}
          className="mt-4 bg-red-500 px-4 py-2 rounded-xl">
          <Text className="text-white font-semibold">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
