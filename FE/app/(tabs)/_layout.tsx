import CustomHeader from "@/components/Header";
import { useAuth } from "@/hooks/useAuth";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TabLayout = () => {
 const insets = useSafeAreaInsets();
 const { isAuthenticated, loading } = useAuth();

 if (loading) {
   return (
     <View className="flex-1 justify-center items-center">
       <ActivityIndicator size="large" />
     </View>
   );
 }

 if (!isAuthenticated) {
   return <Redirect href="/(auth)/sign-in" />;
 }


  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        tabBarActiveTintColor: "#007bff",
        tabBarInactiveTintColor: "#999",
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingVertical: 8,
        },
        tabBarStyle: {
          backgroundColor: "white",
          borderRadius: 30,
          marginHorizontal: 20,
          marginBottom: insets.bottom,
          height: 60,
          position: "absolute",
          borderTopWidth: 0,
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 5,
        },
      }}>
      {/* Semua <Tabs.Screen> tetap */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          header: () => <CustomHeader />,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Feather name="home" size={24} color={color} />
              <Text
                className={`text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Home
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="truck"
        options={{
          title: "Truck",
          header: () => <CustomHeader />,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Feather name="truck" size={24} color={color} />
              <Text
                className={`text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Truck
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="route"
        options={{
          title: "Rute",
          header: () => <CustomHeader />,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={24}
                color={color}
              />
              <Text
                className={`text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Rute
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          header: () => <CustomHeader />,
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={color}
              />
              <Text
                className={`text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Profile
              </Text>
            </View>
          ),
        }}
      />
    </Tabs>
  );
};

const _Layout = () => {
  return (
    <SafeAreaProvider>
      <TabLayout />
    </SafeAreaProvider>
  );
};

export default _Layout;
