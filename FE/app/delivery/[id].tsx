import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StatusBar,
  Modal,
  TextInput,
  Alert as RNAlert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useDeliveryDetail } from "@/hooks/useDeliveryDetail";
import { useWorker, useTruck, useRoute, useSendAlert, useDeliveryPositions } from "@/hooks/useDelivery";
import { getCityName, useCities } from "@/hooks/useTransit";
import { useAuthStatus } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import LeafletMap from "@/components/LeafletMap";

const DeliveryDetail = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuthStatus();
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout |number| null>(
    null
  );
  const [isReportModalVisible, setIsReportModalVisible] = useState(false);
  const [reportType, setReportType] = useState("DRIVER_MESSAGE");
  const [reportMessage, setReportMessage] = useState("");

  const { mutate: sendAlert, isPending: isSendingAlert } = useSendAlert();
  const { data: profileData } = useProfile();
  const userRole = profileData?.data?.role;

  const alertTypes = [
    { value: "accident", label: "🚨 Kecelakaan", color: "text-red-600" },
    { value: "breakdown", label: "🔧 Kerusakan Kendaraan", color: "text-red-600" },
    { value: "puncture", label: "🛞 Ban Pecah", color: "text-amber-600" },
    { value: "fuel_issue", label: "⛽ Masalah Bahan Bakar", color: "text-amber-600" },
    { value: "traffic_delay", label: "🚦 Kemacetan Parah", color: "text-blue-600" },
    { value: "weather_delay", label: "🌧️ Kendala Cuaca", color: "text-blue-600" },
    { value: "driver_message", label: "💬 Pesan Lainnya", color: "text-gray-600" },
  ];

  const delivery_id = Array.isArray(id) ? id[0] : id;

  const {
    data: delivery_data,
    isLoading: delivery_loading,
    error: delivery_error,
  } = useDeliveryDetail(delivery_id);

  const {
    data: positionsData,
    isLoading: positionsLoading
  } = useDeliveryPositions(delivery_id);

  const delivery = delivery_data?.data;
  delivery?.transits.forEach((transit) => {
    console.log({ transit });
  });

  console.log({delivery});

  const { data: worker_data } = useWorker(delivery?.worker_id || "");
  const { data: truck_data } = useTruck(delivery?.truck_id || "");
  const { data: route_data } = useRoute(delivery?.route_id || "");
  const { data: citiesData } = useCities();

  const worker = worker_data?.data;
  const truck = truck_data?.data;
  const route = route_data?.data;
  const alerts = delivery?.alerts || [];

  // Auto-refresh for active deliveries
  useEffect(() => {
    const isActiveDelivery =
      delivery?.started_at! > 0 && delivery?.finished_at === 0;

    if (isActiveDelivery) {
      const interval = setInterval(() => {
        // Placeholder for future active polling if needed
      }, 900000); // 15 minutes

      setRefreshInterval(interval);

      return () => {
        if (interval) {
          clearInterval(interval);
        }
      };
    } else {
      if (refreshInterval) {
        clearInterval(refreshInterval);
        setRefreshInterval(null);
      }
    }
  }, [delivery?.started_at, delivery?.finished_at, refreshInterval]);

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

  const formatPositionTime = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleString("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
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

  if (delivery_loading) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

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

  const handleSendReport = () => {
    if (!reportMessage.trim()) {
      RNAlert.alert("Error", "Pesan laporan tidak boleh kosong");
      return;
    }

    sendAlert({
      delivery_id: delivery_id,
      type: reportType,
      message: reportMessage,
    }, {
      onSuccess: () => {
        RNAlert.alert("Berhasil", "Laporan Anda telah terkirim ke sistem pusat.");
        setIsReportModalVisible(false);
        setReportMessage("");
      },
      onError: (err: any) => {
        RNAlert.alert("Gagal", err?.message || "Terjadi kesalahan saat mengirim laporan.");
      }
    });
  };

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
        {/* Map for Owners Only */}
        {/* {userRole === "OWNER" && (
          <View className="px-6 pt-6">
            <Text className="text-gray-800 font-bold text-lg mb-2">
              Monitoring Lokasi
            </Text>
            <LeafletMap 
              positions={positionsData?.data || []} 
              height={300} 
            />
          </View>
        )} */}

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

            {/* Destination Info (Simplified instead of real-time map) */}
            <View className="bg-blue-50 rounded-xl p-4 mb-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="location" size={20} color="#2563EB" />
                <Text className="text-blue-800 font-semibold ml-2">
                  Lokasi Tujuan
                </Text>
              </View>
              <Text className="text-gray-800 font-medium text-base">
                {route?.end_city_name || "Memuat..."}
              </Text>
              <Text className="text-gray-500 text-xs mt-1">
                Sesuai dengan rute yang telah ditentukan
              </Text>
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
                  : "Loading..."}{" "}
                ({route?.cargo_type})
              </Text>
              {route && (
                <Text className="text-gray-600 text-sm mt-1">
                  {route.distance_km} km • {route.estimated_duration_hours} jam
                  estimasi
                </Text>
              )}
            </View>

            {/* Alert History Section */}
            {alerts.length > 0 && (
              <View className="bg-red-50 rounded-xl p-4 mb-6 border border-red-100">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="warning" size={20} color="#EF4444" />
                  <Text className="text-red-800 font-bold ml-2">
                    Laporan Kendala ({alerts.length})
                  </Text>
                </View>
                {alerts.map((alert, index) => (
                  <View
                    key={alert.id}
                    className={`pb-3 ${index !== alerts.length - 1 ? "mb-3 border-b border-red-100" : ""}`}
                  >
                    <View className="flex-row justify-between items-center mb-1">
                      <Text className="text-red-700 font-bold text-sm uppercase">
                        {alert.type.replace("_", " ")}
                      </Text>
                      <Text className="text-gray-500 text-[10px]">
                        {formatPositionTime(alert.created_at)}
                      </Text>
                    </View>
                    <Text className="text-gray-700 text-sm">
                      {alert.message}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* Cost Breakdown */}
            <View className="border-t border-gray-200 pt-4">
              <Text className="text-gray-800 font-bold text-lg mb-4">
                Rincian Biaya
              </Text>

              <View className="space-y-2">
                <View className="flex-row justify-between">
                  <Text style={{ lineHeight: 22 }} className="text-gray-600">
                    {route
                      ? `${route.start_city_name} → ${route.end_city_name}`
                      : "Loading..."}{" "}
                    ({route?.cargo_type})
                  </Text>
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
                          {getCityName(
                            transit.transit_point.loading_city_id,
                            citiesData?.data
                          )}{" "}
                          →{" "}
                          {getCityName(
                            transit.transit_point.unloading_city_id,
                            citiesData?.data
                          )}{" "}
                          ({transit.transit_point.cargo_type ?? "-"})
                        </Text>
                        <Text
                          style={{ lineHeight: 22 }}
                          className="text-gray-800 font-medium">
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

        {/* Footer */}
        <View className="h-32" />
      </ScrollView>

      {/* Floating Action Button for Emergency/Report (Driver Only) */}
      {delivery && !delivery.finished_at && userRole === 'DRIVER' && (
         <TouchableOpacity 
          style={{ position: 'absolute', bottom: 30, right: 24, zIndex: 9999, elevation: 5 }}
          className="bg-red-600 w-16 h-16 rounded-full items-center justify-center shadow-lg"
          onPress={() => setIsReportModalVisible(true)}
         >
           <Ionicons name="warning" size={32} color="white" />
         </TouchableOpacity>
      )}

      {/* Report Modal */}
      <Modal
        visible={isReportModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsReportModalVisible(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
           <View className="bg-white rounded-t-3xl p-6">
              <View className="flex-row justify-between items-center mb-6">
                 <Text className="text-xl font-bold text-gray-800">Laporkan Kendala</Text>
                 <TouchableOpacity onPress={() => setIsReportModalVisible(false)}>
                    <Ionicons name="close" size={24} color="#9CA3AF" />
                 </TouchableOpacity>
              </View>

              <Text className="text-gray-600 text-sm font-semibold mb-3 tracking-wide">PILIH TIPE KENDALA</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6 -mx-2 px-2">
                 <View className="flex-row gap-2">
                    {alertTypes.map((type) => (
                       <TouchableOpacity
                         key={type.value}
                         onPress={() => setReportType(type.value)}
                         className={`px-4 py-3 rounded-2xl border flex-row items-center gap-2 ${
                           reportType === type.value 
                             ? "bg-blue-600 border-blue-600" 
                             : "bg-gray-50 border-gray-200"
                         }`}
                       >
                          <Text className={`text-sm font-bold ${
                            reportType === type.value ? "text-white" : "text-gray-700"
                          }`}>
                             {type.label}
                          </Text>
                       </TouchableOpacity>
                    ))}
                 </View>
              </ScrollView>

              <Text className="text-gray-600 text-sm font-semibold mb-3 tracking-wide">DETAIL LAPORAN</Text>
              <TextInput
                className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-gray-800 min-h-[120] mb-8"
                placeholder="Jelaskan kendala yang terjadi secara detail..."
                multiline
                textAlignVertical="top"
                value={reportMessage}
                onChangeText={setReportMessage}
              />

              <TouchableOpacity 
                className={`py-4 rounded-2xl items-center ${
                  isSendingAlert ? "bg-red-400" : "bg-red-600"
                }`}
                onPress={handleSendReport}
                disabled={isSendingAlert}
              >
                 {isSendingAlert ? (
                    <ActivityIndicator color="white" />
                 ) : (
                    <Text className="text-white font-bold text-lg">Kirim Laporan Sekarang</Text>
                 )}
              </TouchableOpacity>
              
              <View style={{ height: insets.bottom }} />
           </View>
        </View>
      </Modal>
    </View>
  );
};

export default DeliveryDetail;
