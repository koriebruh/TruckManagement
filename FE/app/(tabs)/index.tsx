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

const TruckTracker = () => {
  const insets = useSafeAreaInsets();

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

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      {/* Content with proper padding for tab bar */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}>
        {/* Stats Cards */}
        <View className="px-4 py-4">
          <View className="flex-row">
            {statsData.map((stat, index) => (
              <View
                key={index}
                className={`flex-1 p-4 rounded-lg border ${stat.color} ${index !== 0 ? "ml-4" : ""}`}>
                <View className="flex-row items-center mb-2">
                  <Text className={`text-sm font-medium ${stat.textColor}`}>
                    {stat.title}
                  </Text>
                  <Ionicons name={stat.icon} size={20} color={stat.iconColor} />
                </View>
                <Text className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Map Container */}
        <View className="mx-4 mb-4">
          <View className="bg-blue-100 rounded-lg h-64 items-center justify-center border border-blue-200">
            <Ionicons name="map" size={48} color="#3B82F6" />
            <Text className="text-blue-600 mt-2 font-medium">Map View</Text>
            <Text className="text-blue-500 text-sm mt-1">
              Leaflet © OpenStreetMap contributors
            </Text>
          </View>
        </View>

        {/* Section Headers */}
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

        {/* Tracking List */}
        <View className="px-4">
          {trackingData.map((item) => (
            <TouchableOpacity
              key={item.id}
              className="bg-white rounded-lg p-4 mb-3 border border-gray-200">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <View className="flex-row items-center mb-2">
                    <View
                      className={`w-3 h-3 rounded-full ${item.statusColor} mr-2`}
                    />
                    <Text className="text-sm font-medium text-gray-600">
                      {item.status}
                    </Text>
                  </View>
                  <Text className="text-lg font-semibold text-gray-800 mb-1">
                    {item.route}
                  </Text>
                  {item.driver && (
                    <View className="flex-row items-center mb-1">
                      <Ionicons name="person" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-1">{item.driver}</Text>
                    </View>
                  )}
                  {item.time && (
                    <View className="flex-row items-center">
                      <Ionicons name="time" size={16} color="#6B7280" />
                      <Text className="text-gray-600 ml-1">
                        Mulai: {item.time}
                      </Text>
                    </View>
                  )}
                </View>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default TruckTracker;
