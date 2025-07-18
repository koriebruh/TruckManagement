import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity, // Import TouchableOpacity
} from "react-native";
import { Link } from "expo-router"; // Import Link untuk navigasi
import { useAuth } from "@/context/AuthContext";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const [error, setError] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      setError("Username dan password harus diisi.");
      return;
    }
    try {
      setError("");
      await login(username, password);
      // Navigasi ke halaman utama akan ditangani oleh _layout.tsx
    } catch (e) {
      setError(e.message);
      Alert.alert("Login Gagal", e.message);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <View className="flex-1 justify-center px-8">
        <View className="mb-12">
          <Text className="text-4xl font-light text-gray-800 text-center mb-2">
            Selamat Datang
          </Text>
          <Text className="text-base text-gray-500 text-center font-light">
            Silakan masuk ke akun Anda
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* Username Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Username
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Masukkan username Anda"
              placeholderTextColor="#9CA3AF"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>

          {/* Password Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Password
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Masukkan password Anda"
              placeholderTextColor="#9CA3AF"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-center text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Login Button */}
          <TouchableOpacity
            className="bg-blue-600 h-14 rounded-xl justify-center items-center mb-4 shadow-sm active:bg-blue-700"
            onPress={handleLogin}>
            <Text className="text-white font-semibold text-lg">Masuk</Text>
          </TouchableOpacity>
        </View>

        {/* Register Link */}
        <View className="items-center">
          <Link href="/sign-up" asChild>
            <TouchableOpacity className="py-3 px-6">
              <Text className="text-gray-600 text-center text-base">
                Belum punya akun?{" "}
                <Text className="text-blue-600 font-medium">
                  Daftar di sini
                </Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
