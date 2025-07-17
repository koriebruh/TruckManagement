import { useLocalSearchParams } from "expo-router";
import { View, Text } from "react-native";

export default function TruckDetail() {
  const { value } = useLocalSearchParams();

  return (
    <View className="flex-1 justify-center items-center">
      <Text className="text-xl font-bold">Detail Truck: {value}</Text>
    </View>
  );
}
