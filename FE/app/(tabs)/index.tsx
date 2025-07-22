import {
  View,
  Text,
  StatusBar,
  ScrollView,
  RefreshControl,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DeliveryList from "@/components/DeliveryList";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeliveries } from "@/hooks/useDeliveries";

const Dashboard = () => {
  const insets = useSafeAreaInsets();

  const {
    data: activeDeliveries,
    isLoading,
    isError,
    refetch,
    error,
  } = useDeliveries();

  const handleRetry = () => {
    refetch();
  };

  const handleSelectDelivery = (deliveryId: string) => {
    console.log("Selected delivery:", deliveryId);
    // TODO: Navigate to delivery detail page
  };

  const renderError = () => (
    <View className="py-8 items-center px-4">
      <Text className="text-red-600 font-medium text-center">
        Gagal memuat data pengiriman.
      </Text>
      <Text className="text-gray-500 text-sm text-center mt-1">
        {error?.message || "Terjadi kesalahan tak terduga."}
      </Text>
      <TouchableOpacity
        className="mt-4 bg-blue-600 px-4 py-2 rounded-lg"
        onPress={handleRetry}>
        <Text className="text-white font-semibold">Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={handleRetry}
            colors={["#1E40AF"]}
          />
        }>
        {/* Map View */}
        <View className="mx-4 mb-4">
          <View className="bg-blue-100 rounded-lg h-64 items-center justify-center border border-blue-200">
            <Ionicons name="map" size={48} color="#3B82F6" />
            <Text className="text-blue-600 mt-2 font-medium">Map View</Text>
            <Text className="text-blue-500 text-sm mt-1">
              Leaflet © OpenStreetMap contributors
            </Text>
          </View>
        </View>

        {/* Tab Navigation */}
        <View className="px-4 mb-4">
          <View className="flex-row">
            <TouchableOpacity className="mr-6">
              <Text className="text-blue-600 font-semibold text-base border-b-2 border-blue-600 pb-1">
                Pengiriman Aktif ({activeDeliveries?.length || 0})
              </Text>
            </TouchableOpacity>
            <TouchableOpacity>
              <Text className="text-gray-500 font-medium text-base">
                Alert Terkini
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content */}
        {isLoading ? (
          <View className="py-8 items-center">
            <ActivityIndicator size="large" color="#1E40AF" />
            <Text className="text-gray-500 mt-2">
              Memuat data pengiriman...
            </Text>
          </View>
        ) : isError ? (
          renderError()
        ) : (
          <DeliveryList
            deliveries={activeDeliveries || []}
            onSelect={handleSelectDelivery}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Dashboard;
