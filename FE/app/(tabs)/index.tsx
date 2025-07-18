import TruckList from "@/components/TruckList";
import TruckStats from "@/components/TruckStats";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "../../context/AuthContext"; // ganti Clerk ke context sendiri

const TruckTracker = () => {
  const insets = useSafeAreaInsets();
  const { isAuthenticated, user } = useAuth(); // ambil dari context

  const statsData = [
    {
      title: "Truk Aktif",
      value: "24",
      icon: "car-outline",
      color: "bg-blue-50 border-blue-200",
      textColor: "text-blue-600",
      iconColor: "#3B82F6",
    },
    {
      title: "Pengiriman",
      value: "18",
      icon: "checkmark-circle-outline",
      color: "bg-green-50 border-green-200",
      textColor: "text-green-600",
      iconColor: "#10B981",
    },
  ];

  const trackingData = [
    {
      id: 1,
      status: "Aktif",
      route: "Jakarta - Bandung",
      driver: "Budi Santoso",
      time: "08:30 WIB",
      statusColor: "bg-blue-500",
    },
    {
      id: 2,
      status: "Aktif",
      route: "Surabaya - Malang",
      driver: "Agus Wijaya",
      time: "09:15 WIB",
      statusColor: "bg-blue-500",
    },
    {
      id: 3,
      status: "Terlambat",
      route: "Semarang - Solo",
      driver: "",
      time: "",
      statusColor: "bg-red-500",
    },
  ];

  console.log("Signed In:", isAuthenticated);
  console.log("User:", user);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}>
        <TruckStats statsData={statsData} />

        <View className="mx-4 mb-4">
          <View className="bg-blue-100 rounded-lg h-64 items-center justify-center border border-blue-200">
            <Ionicons name="map" size={48} color="#3B82F6" />
            <Text className="text-blue-600 mt-2 font-medium">Map View</Text>
            <Text className="text-blue-500 text-sm mt-1">
              Leaflet © OpenStreetMap contributors
            </Text>
          </View>
        </View>

        <View className="px-4 mb-4">
          <View className="flex-row">
            <TouchableOpacity className="mr-6">
              <Text className="text-blue-600 font-semibold text-base border-b-2 border-blue-600 pb-1">
                Pengiriman Aktif
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-500 font-medium text-base">
                Alert Terkini
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TruckList trackingData={trackingData} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default TruckTracker;
