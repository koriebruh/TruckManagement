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
  const [formError, setFormError] = useState("");


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
      setFormError(error as any);
      console.log(error.message);
    }
  };

  return (
    <ScrollView
      className="bg-gradient-to-br from-slate-50 to-gray-100"
      contentContainerClassName="flex-grow justify-center py-8 px-8">
      {/* Header Section */}
      <View className="mb-8">
        <Text className="text-4xl font-light text-gray-800 text-center mb-2">
          Buat Akun Baru
        </Text>
        <Text className="text-base text-gray-500 text-center font-light">
          Bergabunglah dengan kami hari ini
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
            value={formData.username}
            onChangeText={(v) => handleInputChange("username", v)}
          />
        </View>

        {/* Email Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">Email</Text>
          <TextInput
            className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
            placeholder="Masukkan email Anda"
            placeholderTextColor="#9CA3AF"
            value={formData.email}
            onChangeText={(v) => handleInputChange("email", v)}
            keyboardType="email-address"
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
            value={formData.password}
            onChangeText={(v) => handleInputChange("password", v)}
            secureTextEntry
          />
        </View>

        {/* Phone Number Input */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Nomor Telepon
          </Text>
          <TextInput
            className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
            placeholder="Masukkan nomor telepon Anda"
            placeholderTextColor="#9CA3AF"
            value={formData.phone_number}
            onChangeText={(v) => handleInputChange("phone_number", v)}
            keyboardType="phone-pad"
          />
        </View>

        {/* Age Input */}
        <View className="">
          <Text className="text-sm font-medium text-gray-700 mb-2">Umur</Text>
          <TextInput
            className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
            placeholder="Masukkan umur Anda"
            placeholderTextColor="#9CA3AF"
            value={formData.age}
            onChangeText={(v) => handleInputChange("age", v)}
            keyboardType="numeric"
          />
        </View>

        {formError ? (
          <Text className="text-red-500 text-sm mt-2 mb-8">{formError}</Text>
        ) : null}

        {/* Register Button */}
        <TouchableOpacity
          className="bg-blue-600 h-14 rounded-xl justify-center items-center mb-4 shadow-sm active:bg-blue-700"
          onPress={handleRegister}>
          <Text className="text-white font-semibold text-lg">
            Daftar Sekarang
          </Text>
        </TouchableOpacity>
      </View>

      {/* Login Link */}
      <View className="items-center pb-8">
        <Link href="/sign-in" asChild>
          <TouchableOpacity className="py-3 px-6">
            <Text className="text-gray-600 text-center text-base">
              Sudah punya akun?{" "}
              <Text className="text-blue-600 font-medium">Login di sini</Text>
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
    </ScrollView>
  );
}
