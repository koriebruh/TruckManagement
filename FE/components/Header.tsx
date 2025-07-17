import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useUser } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";

export default function CustomHeader() {
  const insets = useSafeAreaInsets();
  const { user } = useUser();
  const router = useRouter();

  return (
    <View className="bg-blue-700" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        <View className="flex-row items-center">
          <Ionicons name="car" size={24} color="white" />
          <Text className="text-white text-xl font-bold ml-2">
            TruckTracker
          </Text>
        </View>

        <View className="flex-row items-center">
          {/* Notifikasi */}
          <View className="relative mr-4">
            <Ionicons name="notifications" size={24} color="white" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </View>

          {/* Profile */}
          <TouchableOpacity
            className="w-9 h-9 rounded-full bg-blue-600 overflow-hidden"
            onPress={() => router.push("/profile")}>
            {user?.imageUrl ? (
              <Image
                source={{ uri: user.imageUrl }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Ionicons
                name="person"
                size={20}
                color="white"
                className="m-auto"
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
