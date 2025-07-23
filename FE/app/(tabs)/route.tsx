import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
  Pressable,
  Alert,
} from "react-native";
import React from "react";
import { useRoutes } from "@/hooks/useRoutes";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const Route = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { routes, isLoading, isError, error, deleteRoute } = useRoutes();

  if (isLoading) return <ActivityIndicator size="large" className="mt-10" />;
 if (isError)
   return (
     <Text className="text-red-500 text-center mt-10">
       {error?.message ?? "Terjadi kesalahan"}
     </Text>
   );


    const handleDelete = (id: string) => {
      Alert.alert("Hapus Rute", "Apakah Anda yakin ingin menghapus rute ini?", [
        { text: "Batal", style: "cancel" },
        {
          text: "Hapus",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteRoute(id);
            } catch (e) {
              console.error("Gagal menghapus rute:", e);
              alert("Gagal menghapus rute.");
            }
          },
        },
      ]);
    };

  return (
    <View className="flex-1" style={{ paddingBottom: insets.bottom + 48 }}>
      <View className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Daftar Rute
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {routes.length} rute terdaftar
            </Text>
          </View>
          <Pressable
            className="px-5 py-3 bg-blue-500 rounded-xl shadow-sm active:bg-blue-600"
            onPress={() => router.push("/route/create")}>
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Tambah</Text>
            </View>
          </Pressable>
        </View>
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
              <Text className="text-lg font-semibold ml-2 text-gray-800 max-w-xs">
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
                className={`px-2 py-1 rounded-full text-xs font-bold  ${
                  item.is_active
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}>
                {item.is_active ? "Rute Aktif" : "Rute Nonaktif"}
              </Text>
            </View>

            {/* Tombol Edit */}
            <View className="flex-row justify-end items-center gap-3 mt-2">
              {/* Tombol Edit */}
              <TouchableOpacity
                onPress={() => router.push(`/route/edit/${item.id}`)}
                className="bg-yellow-400 py-2 px-4 rounded-md active:bg-yellow-500">
                <Text className="text-sm text-white font-semibold text-center">
                  Edit
                </Text>
              </TouchableOpacity>

              {/* Tombol Delete */}
              <TouchableOpacity
                onPress={() => handleDelete(item.id)}
                className="bg-red-500 py-2 px-4 rounded-md active:bg-red-600">
                <Text className="text-sm text-white font-semibold text-center">
                  Nonaktifkan
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default Route;
