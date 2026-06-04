import { Redirect } from "expo-router";
import { useAuthStatus } from "@/hooks/useAuth";
import { ActivityIndicator, View, Text } from "react-native";

export default function Index() {
  const { isAuthenticated, isLoading } = useAuthStatus();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#007bff" />
        <Text className="text-gray-500 mt-4">Loading...</Text>
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(tabs)/index" />;
  }

  return <Redirect href="/(auth)/login" />;
}
