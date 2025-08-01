import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDeliveryDetail } from "@/hooks/useDeliveryDetail";
import { useWorker, useTruck, useRoute } from "@/hooks/useDelivery";
import { useCities, useCityById, useTransitPointDetails, useTransitPoints } from "@/hooks/useTransit";

const DeliveryDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();

  const delivery_id = Array.isArray(id) ? id[0] : id;

  const {
    data: delivery_data,
    isLoading: delivery_loading,
    error: delivery_error,
  } = useDeliveryDetail(delivery_id);

  const delivery = delivery_data?.data;

  const { data: worker_data } = useWorker(delivery?.worker_id || "");
  const { data: truck_data } = useTruck(delivery?.truck_id || "");
  const { data: route_data } = useRoute(delivery?.route_id || "");


  const worker = worker_data?.data;
  const truck = truck_data?.data;
  const route = route_data?.data;

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const calculateTotalCost = () => {
    let total = route?.base_price || 0;

    // Add extra costs from transits
    delivery?.transits.forEach((transit) => {
      if (transit.is_accepted) {
        total += transit.transit_point.extra_cost;
      }
    });

    return total;
  };

  const getCityName = () => {
    let start_city_id = 0;
    let end_city_id = 0;

     delivery?.transits.forEach((transit) => {
       if (transit.is_accepted) {
         start_city_id = transit.transit_point.loading_city_id;
         end_city_id = transit.transit_point.unloading_city_id;
       }
     });

     return {
       start: start_city_id,
       end: end_city_id
     }
  }

  const start = getCityName();
  const start_city_id = start.start;
  const end_city_id = start.end;

  const {data: start_city_name} = useCityById(start_city_id);
  const {data: end_city_name} = useCityById(end_city_id);


  

  const getDeliveryStatus = () => {
    if (!delivery) return { status: "Unknown", color: "gray" };

    if (delivery.finished_at > 0) {
      return { status: "Selesai", color: "green" };
    } else if (delivery.started_at > 0) {
      return { status: "Dalam Perjalanan", color: "blue" };
    } else {
      return { status: "Menunggu", color: "orange" };
    }
  };

  console.log("transit:"+ " " + delivery);

  if (delivery_loading) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              Detail Delivery
            </Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#2563EB" />
          <Text className="text-gray-500 mt-4">Memuat detail delivery...</Text>
        </View>
      </View>
    );
  }

  if (delivery_error || !delivery) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              Detail Delivery
            </Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center px-6">
          <Ionicons name="alert-circle" size={64} color="#EF4444" />
          <Text className="text-gray-800 text-lg font-semibold mt-4 text-center">
            Delivery Tidak Ditemukan
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Data delivery tidak dapat dimuat
          </Text>
        </View>
      </View>
    );
  }

  const status = getDeliveryStatus();
  const total_cost = calculateTotalCost();

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">
              Detail Delivery
            </Text>
          </View>
          <View className={`px-3 py-1 rounded-full bg-${status.color}-100`}>
            <Text className={`text-sm font-medium text-${status.color}-700`}>
              {status.status}
            </Text>
          </View>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Nota Header */}
        <View className="bg-white mx-6 mt-6 rounded-t-2xl border border-gray-200">
          <View className="bg-blue-600 rounded-t-2xl px-6 py-4">
            <Text className="text-white text-center text-lg font-bold">
              NOTA DELIVERY
            </Text>
            <Text className="text-blue-100 text-center text-sm mt-1">
              #{delivery.id.slice(-8).toUpperCase()}
            </Text>
          </View>

          {/* Delivery Info */}
          <View className="px-6 py-4">
            <View className="flex-row justify-between items-start mb-4">
              <View className="flex-1">
                <Text className="text-gray-500 text-sm mb-1">
                  Tanggal Mulai
                </Text>
                <Text className="text-gray-800 font-medium">
                  {formatDate(delivery.started_at)}
                </Text>
              </View>
              {delivery.finished_at > 0 && (
                <View className="flex-1">
                  <Text className="text-gray-500 text-sm mb-1">
                    Tanggal Selesai
                  </Text>
                  <Text className="text-gray-800 font-medium">
                    {formatDate(delivery.finished_at)}
                  </Text>
                </View>
              )}
            </View>

            {/* Driver Info */}
            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="person" size={20} color="#2563EB" />
                <Text className="text-blue-800 font-semibold ml-2">Driver</Text>
              </View>
              <Text className="text-gray-800 font-medium text-lg">
                {worker?.username || "Loading..."}
              </Text>
              {worker?.phone_number && (
                <Text className="text-gray-600 text-sm mt-1">
                  {worker.phone_number}
                </Text>
              )}
            </View>

            {/* Truck Info */}
            <View className="bg-orange-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="car" size={20} color="#EA580C" />
                <Text className="text-orange-800 font-semibold ml-2">
                  Kendaraan
                </Text>
              </View>
              <Text className="text-gray-800 font-bold text-xl">
                {truck?.license_plate || delivery.truck_id}
              </Text>
              {truck?.model && (
                <Text className="text-gray-600 text-sm mt-1">
                  {truck.model} • Kapasitas: {truck.capacity_kg} kg
                </Text>
              )}
            </View>

            {/* Route Info */}
            <View className="bg-green-50 rounded-xl p-4 mb-6">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={20} color="#059669" />
                <Text className="text-green-800 font-semibold ml-2">Rute</Text>
              </View>
              <Text className="text-gray-800 font-medium text-lg">
                {route
                  ? `${route.start_city_name} → ${route.end_city_name}`
                  : "Loading..."}
              </Text>
              {route && (
                <Text className="text-gray-600 text-sm mt-1">
                  {route.distance_km} km • {route.estimated_duration_hours} jam
                  estimasi
                </Text>
              )}
            </View>

            {/* Cost Breakdown */}
            <View className="border-t border-gray-200 pt-4">
              <Text className="text-gray-800 font-bold text-lg mb-4">
                Rincian Biaya
              </Text>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text className="text-gray-600">Biaya Dasar Rute</Text>
                  <Text className="text-gray-800 font-medium">
                    {formatCurrency(route?.base_price || 0)}
                  </Text>
                </View>

                {delivery.transits.map(
                  (transit, index) =>
                    transit.is_accepted && (
                      <View
                        key={transit.id}
                        className="flex-row justify-between mt-2">
                        <Text className="text-gray-600">
                          {start_city_name?.data.name} → {end_city_name?.data.name}
                        </Text>
                        <Text className="text-gray-800 font-medium">
                          {formatCurrency(transit.transit_point.extra_cost)}
                        </Text>
                      </View>
                    )
                )}

                <View className="border-t border-gray-200 pt-2 mt-2">
                  <View className="flex-row justify-between">
                    <Text className="text-gray-800 font-bold text-lg">
                      Total Biaya
                    </Text>
                    <Text className="text-blue-600 font-bold text-xl">
                      {formatCurrency(total_cost)}
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Footer
        <View className="bg-white mx-6 rounded-b-2xl border-l border-r border-b border-gray-200 mb-6">
          <View className="px-6 py-4 border-t border-dashed border-gray-300">
            <Text className="text-center text-gray-500 text-sm">
              Terima kasih atas kepercayaan Anda
            </Text>
            <Text className="text-center text-gray-400 text-xs mt-1">
              Dokumen ini dicetak otomatis oleh sistem
            </Text>
          </View>
        </View> */}
      </ScrollView>
    </View>
  );
};

export default DeliveryDetail;
