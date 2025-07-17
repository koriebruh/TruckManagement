import {  Stack } from "expo-router";
import { tokenCache } from "@clerk/clerk-expo/token-cache";
import "./global.css";
import { ClerkProvider } from "@clerk/clerk-expo";

export default function RootLayout() {
  
  return (
    <ClerkProvider tokenCache={tokenCache}>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="truck/[value]" options={{ headerShown: false }} />
      </Stack>
    </ClerkProvider>
  );
}
