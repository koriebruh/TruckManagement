import { useTrucks } from "@/hooks/useTrucks";
import { Truck } from "@/types/truck.types";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Alert,
  Pressable,
  Text,
  View,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from "react-native";

export default function TruckList() {
  const router = useRouter();
  const { trucks, loading, error, deleteTruck, refetch, setMaintenanceTruck } =
    useTrucks();

  const handleDelete = async (id: string) => {
    Alert.alert("Hapus Truk", "Apakah kamu yakin ingin menghapus truk ini?", [
      {
        text: "Batal",
        style: "cancel",
      },
      {
        text: "Hapus",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteTruck(id);
            refetch();
          } catch (err: any) {
            Alert.alert("Gagal", err.message);
          }
        },
      },
    ]);
  };

  const handleMaintenance = async (id: string) => {
    try {
      await setMaintenanceTruck(id);
      refetch();
    } catch (err: any) {
      Alert.alert("Gagal", err.message);
    }
  };

  const getStatusColor = (isAvailable: boolean) => {
    return isAvailable
      ? "bg-green-100 text-green-800"
      : "bg-red-100 text-red-800";
  };

  const getStatusText = (isAvailable: boolean) => {
    return isAvailable ? "Tersedia" : "Tidak Tersedia";
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-2 text-gray-600">Memuat data truk...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50 px-4">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-gray-900 text-center">
          Terjadi Kesalahan
        </Text>
        <Text className="mt-2 text-gray-600 text-center">{error}</Text>
        <Pressable
          className="mt-6 px-6 py-3 bg-blue-500 rounded-lg"
          onPress={refetch}>
          <Text className="text-white font-semibold">Coba Lagi</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white px-6 py-4 border-b border-gray-200 shadow-sm">
        <View className="flex-row justify-between items-center">
          <View>
            <Text className="text-2xl font-bold text-gray-900">
              Daftar Truk
            </Text>
            <Text className="text-sm text-gray-500 mt-1">
              {trucks.length} truk terdaftar
            </Text>
          </View>
          <Pressable
            className="px-5 py-3 bg-blue-500 rounded-xl shadow-sm active:bg-blue-600"
            onPress={() => router.push("/truck/create")}>
            <View className="flex-row items-center">
              <Ionicons name="add" size={20} color="white" />
              <Text className="text-white font-semibold ml-1">Tambah</Text>
            </View>
          </Pressable>
        </View>
      </View>

      {/* Truck List */}
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16 }}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }>
        {trucks.length === 0 ? (
          <View className="flex-1 justify-center items-center py-20">
            <Ionicons name="car-outline" size={64} color="#9CA3AF" />
            <Text className="mt-4 text-lg font-semibold text-gray-600">
              Belum Ada Truk
            </Text>
            <Text className="mt-2 text-gray-500 text-center">
              Tambahkan truk pertama Anda dengan menekan tombol Tambah
            </Text>
          </View>
        ) : (
          <View className="space-y-4">
            {trucks.map((truck: Truck, index: number) => (
              <View
                key={truck.id || index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header Card */}
                <View className="px-5 py-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                  <View className="flex-row justify-between items-center">
                    <View className="flex-1">
                      <Text className="text-xl font-bold text-gray-900">
                        {truck.model}
                      </Text>
                      <Text className="text-sm text-gray-600 mt-1">
                        {truck.cargo_type}
                      </Text>
                    </View>
                    <View className="items-center">
                      <View className="w-16 h-16 bg-blue-100 rounded-full items-center justify-center">
                        <Ionicons name="car" size={32} color="#3B82F6" />
                      </View>
                    </View>
                  </View>
                </View>

                {/* Content */}
                <View className="px-5 py-4">
                  <View className="flex-row justify-between items-center mb-4">
                    <View className="flex-1">
                      <View className="flex-row items-center mb-2">
                        <Ionicons
                          name="cube-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-sm text-gray-600 ml-2">
                          Jenis Muatan
                        </Text>
                      </View>
                      <Text className="text-sm font-semibold text-gray-900">
                        {truck.cargo_type}
                      </Text>
                    </View>

                    <View className="flex-1 items-center">
                      <View className="flex-row items-center mb-2">
                        <Ionicons
                          name="scale-outline"
                          size={16}
                          color="#6B7280"
                        />
                        <Text className="text-sm text-gray-600 ml-2">
                          Kapasitas
                        </Text>
                      </View>
                      <Text className="text-sm font-semibold text-gray-900">
                        {truck.capacity_kg?.toLocaleString()} kg
                      </Text>
                    </View>

                    <View className="flex-1 items-end">
                      <View
                        className={`px-3 py-1 rounded-full ${getStatusColor(
                          truck.is_available
                        )}`}>
                        <Text className="text-xs font-semibold">
                          {getStatusText(truck.is_available)}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View className="flex-row justify-end gap-5 pt-3 border-t border-gray-100">
                    {truck.is_available && (
                      <Pressable
                        className="px-4 py-2 bg-orange-100 rounded-lg active:bg-orange-200"
                        onPress={() => handleMaintenance(truck.id)}>
                        <View className="flex-row items-center">
                          <Ionicons
                            name="build-outline"
                            size={16}
                            color="#F97316"
                          />
                          <Text className="text-orange-600 font-medium ml-1 text-sm">
                            Maintenance
                          </Text>
                        </View>
                      </Pressable>
                    )}

                    <Pressable
                      className="px-4 py-2 bg-blue-100 rounded-lg active:bg-blue-200"
                      onPress={() => router.push(`/truck/edit/${truck.id}`)}>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="create-outline"
                          size={16}
                          color="#3B82F6"
                        />
                        <Text className="text-blue-600 font-medium ml-1 text-sm">
                          Edit
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      className="px-4 py-2 bg-red-100 rounded-lg active:bg-red-200"
                      onPress={() => handleDelete(truck.id)}>
                      <View className="flex-row items-center">
                        <Ionicons
                          name="trash-outline"
                          size={16}
                          color="#EF4444"
                        />
                        <Text className="text-red-600 font-medium ml-1 text-sm">
                          Hapus
                        </Text>
                      </View>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
