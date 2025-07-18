import { View, Text, ActivityIndicator, FlatList } from "react-native";
import React from "react";
import { useTrucks } from "@/hooks/useTrucks";

export default function TruckList() {
  const { trucks, loading, error } = useTrucks();

  if (loading) return <ActivityIndicator />;
  if (error) return <Text>Error: {error}</Text>;

  return (
    <FlatList
      data={trucks}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <View className="p-4 border-b border-gray-300">
          <Text className="font-bold">
            {item.licensePlate} - {item.model}
          </Text>
          <Text>
            Muatan: {item.cargoType}, {item.capacityKG}kg
          </Text>
          <Text>
            Status: {item.isAvailable ? "Tersedia" : "Tidak tersedia"}
          </Text>
        </View>
      )}
    />
  );
}
