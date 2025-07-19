import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import "./global.css";

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="truck" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
