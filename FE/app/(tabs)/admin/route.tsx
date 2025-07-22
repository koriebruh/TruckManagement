import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import React from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

const Route = () => {
  const router = useRouter();
  const { routes, isLoading, isError, error } = useRoutes();

  if (isLoading) return <ActivityIndicator size="large" className="mt-10" />;
 if (isError)
   return (
     <Text className="text-red-500 text-center mt-10">
       {error?.message ?? "Terjadi kesalahan"}
     </Text>
   );


  return (
    <View className="flex-1">
      {/* Tombol Create */}
      <View className="p-4">
        <TouchableOpacity
          onPress={() => router.push("/route/create")}
          className="bg-blue-600 py-3 px-4 rounded-xl">
          <Text className="text-white text-center font-semibold">
            + Buat Rute
          </Text>
        </TouchableOpacity>
      </View>

      {/* List Rute */}
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-md">
            {/* Rute */}
            <View className="flex-row items-center mb-2">
              <Feather name="map-pin" size={20} color="#4B5563" />
              <Text className="text-lg font-semibold ml-2 text-gray-800">
                {item.start_city_name} → {item.end_city_name}
              </Text>
            </View>

            {/* Detail */}
            <Text className="text-sm text-gray-600 mb-1">
              📝 {item.details}
            </Text>

            {/* Info jarak dan durasi */}
            <View className="flex-row items-center gap-2 mb-1">
              <Feather name="clock" size={16} color="#4B5563" />
              <Text className="text-gray-600 text-sm">
                Jarak: {item.distance_km} km • Estimasi:{" "}
                {item.estimated_duration_hours} jam
              </Text>
            </View>

            {/* Harga */}
            <View className="flex-row items-center gap-2 mb-1">
              <Feather name="dollar-sign" size={16} color="#4B5563" />
              <Text className="text-gray-600 text-sm">
                Harga dasar: Rp {item.base_price.toLocaleString()}
              </Text>
            </View>

            {/* Status */}
            <View className="mt-2 mb-2">
              <Text
                className={`px-2 py-1 rounded-full text-xs font-bold w-max ${
                  item.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                {item.isActive ? "Rute Aktif" : "Rute Nonaktif"}
              </Text>
            </View>

            {/* Tombol Edit */}
            <TouchableOpacity
              onPress={() => router.push(`/route/edit/${item.id}`)}
              className="mt-2 bg-yellow-400 py-2 px-4 rounded-md">
              <Text className="text-sm text-white font-semibold text-center">
                Edit
              </Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default Route;
