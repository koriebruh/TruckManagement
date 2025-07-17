import React from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "@/components/SignOutButton";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Profile = () => {
  const { user } = useUser();
  const insets = useSafeAreaInsets();

  return (
    <ScrollView
      contentContainerStyle={{
        paddingTop: insets.top + 24,
        paddingBottom: insets.bottom + 24,
        paddingHorizontal: 16,
        alignItems: "center",
        backgroundColor: "#f9fafb", // Tailwind: bg-gray-50
        flexGrow: 1,
      }}>
      <View className="items-center p-6 bg-white rounded-2xl shadow-lg w-full max-w-sm">
        {/* Avatar */}
        <Image
          source={{ uri: user?.imageUrl }}
          className="w-24 h-24 rounded-full border-2 border-gray-200 mb-4"
        />

        {/* User Name */}
        <Text className="text-2xl font-semibold text-gray-800 mb-1">
          {user?.fullName || "Unnamed User"}
        </Text>

        {/* Email */}
        <Text className="text-gray-500 mb-5 text-center">
          {user?.primaryEmailAddress?.emailAddress}
        </Text>

        {/* Sign Out Button */}
        <SignOutButton />
      </View>
    </ScrollView>
  );
};

export default Profile;
