import { View, Text, FlatList, ActivityIndicator } from "react-native";
import React from "react";
import { useRoutes } from "@/hooks/useRoutes";

const Route = () => {
  const { routes, loading, error } = useRoutes();

  if (loading) return <ActivityIndicator size="large" className="mt-10" />;
  if (error) return <Text className="text-red-500">{error}</Text>;

  return (
    <FlatList
      data={routes}
      keyExtractor={(item) => item.id}
      contentContainerStyle={{ padding: 16 }}
      renderItem={({ item }) => (
        <View className="bg-white rounded-xl p-4 mb-4 shadow-md">
          <Text className="text-lg font-bold text-gray-800">
            {item.startCityName} → {item.endCityName}
          </Text>
          <Text className="text-gray-600">Detail: {item.details}</Text>
          <Text className="text-gray-600">
            Jarak: {item.distanceKM} km, Estimasi: {item.estimatedDurationHours}{" "}
            jam
          </Text>
          <Text className="text-gray-600">
            Harga dasar: Rp {item.basePrice.toLocaleString()}
          </Text>
          <Text
            className={`mt-1 font-semibold ${
              item.isActive ? "text-green-600" : "text-red-600"
            }`}>
            {item.isActive ? "Aktif" : "Nonaktif"}
          </Text>
        </View>
      )}
    />
  );
};

export default Route;
