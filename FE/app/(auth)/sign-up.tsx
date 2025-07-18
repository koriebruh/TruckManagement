// app/(auth)/register.tsx

import React, { useState } from "react";
import {
  View,
  TextInput,
  Button,
  Alert,
  Text,
  ScrollView,
  TouchableOpacity, // Digunakan untuk link
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function RegisterScreen() {
  const { register } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone_number: "",
    age: "",
  });

  const handleInputChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleRegister = async () => {
    for (const key in formData) {
      if (!formData[key]) {
        Alert.alert("Validasi Gagal", `Kolom "${key}" tidak boleh kosong.`);
        return; // Hentikan eksekusi
      }
    }

    console.log("Data yang akan dikirim ke backend:", formData); 

    try {
      await register({
        ...formData,
        age: parseInt(formData.age, 10),
      });
      Alert.alert("Sukses", "Registrasi berhasil! Silakan login.");
      router.push("/sign-in");
    } catch (error) {
      console.log("Full error object:", JSON.stringify(error, null, 2));
      if (error.response) {
        Alert.alert(
          "Registrasi Gagal",
          error.response.data.errors?.phone_number || // Ambil pesan spesifik jika ada
            error.response.data.errors?.username ||
            error.response.data.errors?.email ||
            "Data yang Anda masukkan tidak valid."
        );
      } else {
        Alert.alert("Registrasi Gagal", "Terjadi kesalahan jaringan.");
      }
    }
  };

  return (
    // Gunakan contentContainerClassName untuk styling di dalam ScrollView
    <ScrollView
      className="bg-white"
      contentContainerClassName="flex-grow justify-center p-5">
      <Text className="text-2xl font-bold text-center mb-5">
        Buat Akun Baru
      </Text>

      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Username"
        value={formData.username}
        onChangeText={(v) => handleInputChange("username", v)}
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Email"
        value={formData.email}
        onChangeText={(v) => handleInputChange("email", v)}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Password"
        value={formData.password}
        onChangeText={(v) => handleInputChange("password", v)}
        secureTextEntry
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Nomor Telepon"
        value={formData.phone_number}
        onChangeText={(v) => handleInputChange("phone_number", v)}
        keyboardType="phone-pad"
      />
      <TextInput
        className="h-12 border border-gray-300 rounded-md px-3 mb-4"
        placeholder="Umur"
        value={formData.age}
        onChangeText={(v) => handleInputChange("age", v)}
        keyboardType="numeric"
      />

      <View className="mb-4">
        <Button title="Register" onPress={handleRegister} />
      </View>

      <Link href="/sign-in" asChild>
        <TouchableOpacity>
          <Text className="text-blue-500 text-center">
            Sudah punya akun? Login.
          </Text>
        </TouchableOpacity>
      </Link>
    </ScrollView>
  );
}
