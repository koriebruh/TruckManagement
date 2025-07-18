// app/(auth)/login.tsx

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Text,
  Alert,
  TouchableOpacity, // Impor TouchableOpacity
} from "react-native";
import { Link } from "expo-router"; // Impor Link untuk navigasi
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
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-2xl font-bold text-center mb-5">
        Selamat Datang!
      </Text>

      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {error ? (
        <Text className="text-red-500 text-center mb-3">{error}</Text>
      ) : null}

      <View className="mb-4">
        <Button title="Login" onPress={handleLogin} />
      </View>

      {/* Tombol untuk mengarah ke halaman register */}
      <Link href="/sign-up" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center">
            Belum punya akun? Daftar di sini.
          </Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}
