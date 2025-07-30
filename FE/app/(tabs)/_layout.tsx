import CustomHeader from "@/components/Header";
import { useAuthStatus } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { Feather, Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const TabLayoutOwner = () => {
 const insets = useSafeAreaInsets();

const { isAuthenticated, isLoading } = useAuthStatus();

console.log(isAuthenticated);

if (isLoading) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size="large" />
    </View>)
}

if (!isAuthenticated) {
  return <Redirect href="/login" />;
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
        name="(tabs)/owner"
        options={{
          title: "Home",
          href: "/(tabs)/owner/index",
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
        name="delivery"
        options={{
          header: () => <CustomHeader />,
          tabBarLabel: "Deliveries",
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Feather name="truck" size={24} color={color} />
              <Text
                className={`w-full text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Deliveries
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
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

const TabLayoutDriver = () => {
  const insets = useSafeAreaInsets();

  const { isAuthenticated, isLoading } = useAuthStatus();

  console.log(isAuthenticated);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!isAuthenticated) {
    return <Redirect href="/login" />;
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
        name="transit"
        options={{
          header: () => <CustomHeader />,
          tabBarLabel: "Transit",
          tabBarIcon: ({ focused, color }) => (
            <View className="items-center h-full">
              <Feather name="aperture" size={24} color={color} />
              <Text
                className={`w-full text-xs mt-1 ${focused ? "text-blue-600 font-medium" : "text-gray-500"}`}>
                Transit
              </Text>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarLabel: "Profile",
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
}

type UserRole = "OWNER" | "DRIVER" | null;

const Layout = () => {
  const [userRole, setUserRole] = useState<UserRole>(null);
  const [isReady, setIsReady] = useState(false);

  const { isAuthenticated, isLoading: authLoading } = useAuthStatus();
  const {
    data: user,
    isLoading: profileLoading,
    error: profileError,
  } = useProfile();

  useEffect(() => {
    // ✅ Wait for both auth and profile to be ready
    if (!authLoading && !profileLoading) {
      if (isAuthenticated && user?.data?.role) {
        setUserRole(user.data.role as UserRole);
      }
      setIsReady(true);
    }
  }, [authLoading, profileLoading, isAuthenticated, user]);

  // ✅ Still loading
  if (!isReady) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-gray-50">
          <ActivityIndicator size="large" color="#007bff" />
          <Text className="text-gray-500 mt-4">Initializing...</Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // ✅ Not authenticated
  if (!isAuthenticated) {
    return <Redirect href="/login" />;
  }

  // ✅ Profile error
  if (profileError || !userRole) {
    return (
      <SafeAreaProvider>
        <View className="flex-1 justify-center items-center bg-gray-50 px-6">
          <Text className="text-red-500 text-lg font-semibold">
            Profile Error
          </Text>
          <Text className="text-gray-500 text-center mt-2">
            Please restart the app or contact support
          </Text>
        </View>
      </SafeAreaProvider>
    );
  }

  // ✅ Render based on role
  return (
    <SafeAreaProvider>
      {userRole === "OWNER" ? <TabLayoutOwner /> : <TabLayoutDriver />}
    </SafeAreaProvider>
  );
};


