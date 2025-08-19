import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import DeliveryCard from "@/components/DeliveryCard";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useDeliveryByWorker } from "@/hooks/useDelivery";
import { useProfile } from "@/hooks/useProfile";
import { usePositionTracker } from "@/hooks/usePositionTracker";

const DashboardDriver = () => {
  const insets = useSafeAreaInsets();
  const { data: user } = useProfile();
  const worker_id = user?.data.id || "";
  const [nextUpdateCountdown, setNextUpdateCountdown] = useState<string>("");

  const {
    data: deliveriesData,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useDeliveryByWorker(worker_id);

  // Position tracking with automatic start and 15-minute intervals
  const {
    isTracking,
    location,
    isLoadingLocation,
    locationError,
    isSendingPosition,
    sendPositionError,
    lastSentAt,
  } = usePositionTracker({
    autoTrack: true, // Auto-start when component mounts
    interval: 900000, // Send position every 15 minutes (15 * 60 * 1000 ms)
  });

  const router = useRouter();

  // Countdown timer for next update
  useEffect(() => {
    if (!isTracking || !lastSentAt) {
      setNextUpdateCountdown("");
      return;
    }

    const updateCountdown = () => {
      const now = Date.now();
      const lastSent = lastSentAt.getTime();
      const nextUpdate = lastSent + 900000; // 15 minutes
      const timeLeft = nextUpdate - now;

      if (timeLeft <= 0) {
        setNextUpdateCountdown("Sending soon...");
      } else {
        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        setNextUpdateCountdown(`${minutes}m ${seconds}s`);
      }
    };

    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => clearInterval(countdownInterval);
  }, [isTracking, lastSentAt]);

  // Handle location errors with automatic retry
  useEffect(() => {
    if (locationError) {
      console.error("Location error detected:", locationError);
      // Just log the error, don't show alert for automatic system
      // The system will automatically retry in the next interval
    }
  }, [locationError]);

  // Handle position send errors (silent logging for automatic system)
  useEffect(() => {
    if (sendPositionError) {
      console.error("Automatic position send error:", sendPositionError);
      // Silent error handling - system will automatically retry in next interval
    }
  }, [sendPositionError]);

  const handleRefresh = () => {
    refetch();
  };

  const handleDeliveryPress = (deliveryId: string) => {
    console.log("Navigate to delivery:", deliveryId);
    router.push(`/delivery/${deliveryId}`);
  };

  // Loading state
  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-4">Memuat data delivery...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Error state
  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Gagal Memuat Data
          </Text>
          <Text className="text-gray-500 text-center mt-2 mb-6">
            Terjadi kesalahan saat mengambil data delivery aktif
          </Text>
          <TouchableOpacity
            className="bg-blue-600 px-6 py-3 rounded-xl"
            onPress={handleRefresh}>
            <Text className="text-white font-semibold">Coba Lagi</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const deliveries = deliveriesData?.data || null;

  return (
    <View style={{ marginBottom: insets.bottom }} className="flex-1 bg-gray-50">
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: insets.bottom + 100 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            colors={["#2563EB"]}
            tintColor="#2563EB"
          />
        }>
        {/* Header with Location Status */}
        <View
          style={{ marginTop: insets.top }}
          className="flex-row justify-between items-start mb-4">
          <View className="flex-1">
            <Text className="text-xl font-bold text-gray-800">
              Delivery Aktif
            </Text>

            {/* Automatic Location Status */}
            <View className="flex-row items-center mt-2">
              <Ionicons
                name="radio"
                size={16}
                color={isTracking ? "#10B981" : "#9CA3AF"}
              />
              <Text
                className={`text-base ml-1 ${isTracking ? "text-green-600" : "text-gray-500"}`}>
                {isLoadingLocation
                  ? "Initializing location..."
                  : isTracking
                    ? "Auto-tracking (15 min interval)"
                    : "Connecting to location services..."}
              </Text>
              {(isSendingPosition || isLoadingLocation) && (
                <ActivityIndicator
                  size="small"
                  color="#2563EB"
                  style={{ marginLeft: 8 }}
                />
              )}
            </View>

            {/* Location Info */}
            {location && (
              <Text className="text-sm text-gray-400 mt-1">
                📍{" "}
                {location.city
                  ? location.address
                  : `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`}
              </Text>
            )}

            {/* Automatic Status Info */}
            {isTracking && (
              <>
                {lastSentAt && (
                  <Text className="text-xs text-gray-400 mt-1">
                    ✅ Last sent: {lastSentAt.toLocaleTimeString()}
                  </Text>
                )}

                {nextUpdateCountdown && (
                  <Text className="text-xs text-blue-600">
                    ⏱️ Next update: {nextUpdateCountdown}
                  </Text>
                )}
              </>
            )}

            {!isTracking && (
              <Text className="text-xs text-gray-400 mt-1">
                🔄 Starting automatic tracking...
              </Text>
            )}

            {/* Silent Error Indicator (no alert, just visual indicator) */}
            {sendPositionError && (
              <Text className="text-xs text-orange-600 mt-1">
                ⚠️ Connection issue - will retry automatically
              </Text>
            )}
          </View>
        </View>

        {/* Delivery List */}
        {deliveries === null ? (
          <View className="bg-white rounded-2xl p-8 items-center shadow-sm">
            <Ionicons name="cube-outline" size={48} color="#9CA3AF" />
            <Text className="text-gray-500 text-lg font-medium mt-4">
              Tidak Ada Delivery Aktif
            </Text>
            <Text className="text-gray-400 text-center mt-2">
              Belum ada delivery yang sedang berjalan saat ini
            </Text>
          </View>
        ) : (
          <DeliveryCard
            key={deliveries!.id}
            delivery={deliveries!}
            onPress={() => handleDeliveryPress(deliveries!.id)}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default DashboardDriver;
