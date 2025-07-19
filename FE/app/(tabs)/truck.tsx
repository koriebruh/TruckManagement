import { useTrucks } from "@/hooks/useTrucks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, Pressable, Text, View } from "react-native";

export default function TruckList() {
  const router = useRouter();
  const { trucks, deleteTruck, refetch } = useTrucks();

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

  return (
    <View className="px-4 py-4">
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-xl font-bold">Daftar Truk</Text>
        <Pressable
          className="px-4 py-2 bg-blue-500 rounded-lg"
          onPress={() => router.push("/truck/create")}>
          <Text className="text-white">+ Tambah</Text>
        </Pressable>
      </View>

      <View className="space-y-3">
        {trucks.map((truck: any, index: number) => (
          <View
            key={index}
            className="p-4 rounded-lg border border-gray-300 bg-white">
            <View className="flex-row justify-between items-center">
              <View>
                <Text className="text-lg font-semibold text-gray-900">
                  {truck.licensePlate}
                </Text>
                <Text className="text-sm text-gray-500">{truck.status}</Text>
              </View>
              <Ionicons name="bus" size={28} color="#4B5563" />
            </View>

            <View className="flex-row justify-end mt-3 space-x-3">
              <Pressable
                className="px-3 py-1 rounded-md bg-yellow-400"
                onPress={() => router.push(`/truck/edit/${truck.id}`)}>
                <Text className="text-white">Edit</Text>
              </Pressable>
              <Pressable
                className="px-3 py-1 rounded-md bg-red-500"
                onPress={() => handleDelete(truck.id)}>
                <Text className="text-white">Hapus</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
