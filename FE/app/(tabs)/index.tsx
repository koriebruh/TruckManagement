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
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DeliveryList from "@/components/DeliveryList";
import { useActiveDeliveries } from "@/hooks/useActiveDeliveries";

const Dashboard = () => {
  const insets = useSafeAreaInsets();

  const {
    activeDeliveries,
    isLoading,
    isError,
    refetch,
    error,
  } = useActiveDeliveries();

  const handleRetry = () => {
    refetch();
  };

  const handleSelectDelivery = (deliveryId: string) => {
    console.log("Selected delivery:", deliveryId);
    // TODO: Navigate to delivery detail page
  };

  const renderError = () => (
    <View className="py-8 px-4 items-center">
      <Text className="text-red-600 font-semibold text-center">
        Gagal memuat data pengiriman
      </Text>
      <Text className="text-gray-500 text-sm text-center mt-1">
        {error?.message || "Terjadi kesalahan tak terduga."}
      </Text>
      <TouchableOpacity
        className="mt-4 px-5 py-2 bg-blue-600 rounded-lg"
        onPress={handleRetry}>
        <Text className="text-white font-semibold">Coba Lagi</Text>
      </TouchableOpacity>
    </View>
  );

  const renderMapView = () => (
    <View className="mx-4 mb-4">
      <View className="bg-blue-100 h-64 rounded-2xl items-center justify-center border border-blue-200">
        <Ionicons name="map" size={48} color="#3B82F6" />
        <Text className="text-blue-700 mt-2 font-semibold text-base">
          Map View
        </Text>
        <Text className="text-blue-500 text-sm mt-1">
          Leaflet © OpenStreetMap contributors
        </Text>
      </View>
    </View>
  );

  const renderTabs = () => (
    <View className="px-4 mb-4">
      <View className="flex-row space-x-6">
        <TouchableOpacity>
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
  );

  const renderLoading = () => (
    <View className="py-8 items-center">
      <ActivityIndicator size="large" color="#1E40AF" />
      <Text className="text-gray-500 mt-2">Memuat data pengiriman...</Text>
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
        {renderMapView()}
        {renderTabs()}

        {isLoading ? (
          renderLoading()
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
