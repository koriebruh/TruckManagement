import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CustomHeader() {
  const insets = useSafeAreaInsets();

  return (
    // 3. Gunakan <View> biasa, tapi tambahkan style untuk padding atas secara dinamis
    <View className="bg-blue-700" style={{ paddingTop: insets.top }}>
      <View className="flex-row items-center justify-between px-4 pb-4 pt-2">
        {/* Konten Anda tidak berubah */}
        <View className="flex-row items-center">
          <Ionicons name="car" size={24} color="white" />
          <Text className="text-white text-xl font-bold ml-2">
            TruckTracker
          </Text>
        </View>
        <View className="flex-row items-center">
          <View className="relative mr-4">
            <Ionicons name="notifications" size={24} color="white" />
            <View className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center">
              <Text className="text-white text-xs font-bold">3</Text>
            </View>
          </View>
          <TouchableOpacity className="bg-blue-600 rounded-full p-2">
            <Ionicons name="person" size={20} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
