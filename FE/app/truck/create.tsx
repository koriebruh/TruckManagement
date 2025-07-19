// app/truck/create.tsx
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import React, { useState } from "react";
import { useRouter } from "expo-router";
import api from "@/services/axios";

export default function CreateTruck() {
  const [licensePlate, setLicensePlate] = useState("");
  const [model, setModel] = useState("");
  const [cargoType, setCargoType] = useState("");
  const [capacityKG, setCapacityKG] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async () => {
    if (!licensePlate || !model || !cargoType || !capacityKG) {
      setError("Semua field harus diisi.");
      return;
    }

    try {
      setError("");
      await api.post("/api/trucks", {
        licensePlate,
        model,
        cargoType,
        capacityKG: Number(capacityKG),
        isAvailable: true,
      });
      Alert.alert("Sukses", "Truk berhasil dibuat!");
      router.push("/truck");
    } catch (err) {
      const errorMessage = "Gagal membuat truk. Silakan coba lagi.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
      console.log("❌ Gagal membuat truk:", err);
    }
  };

  return (
    <View className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header Section */}
      <View className="flex-1 justify-center px-8">
        <View className="mb-12">
          <Text className="text-4xl font-light text-gray-800 text-center mb-2">
            Tambah Truk Baru
          </Text>
          <Text className="text-base text-gray-500 text-center font-light">
            Masukkan informasi truk yang akan ditambahkan
          </Text>
        </View>

        {/* Form Container */}
        <View className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* License Plate Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Plat Nomor
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Contoh: B 1234 ABC"
              placeholderTextColor="#9CA3AF"
              value={licensePlate}
              onChangeText={setLicensePlate}
              autoCapitalize="characters"
            />
          </View>

          {/* Model Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Model
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Contoh: Mitsubishi Canter"
              placeholderTextColor="#9CA3AF"
              value={model}
              onChangeText={setModel}
            />
          </View>

          {/* Cargo Type Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Jenis Muatan
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Contoh: Barang Umum"
              placeholderTextColor="#9CA3AF"
              value={cargoType}
              onChangeText={setCargoType}
            />
          </View>

          {/* Capacity Input */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Kapasitas (kg)
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              placeholder="Contoh: 5000"
              placeholderTextColor="#9CA3AF"
              value={capacityKG}
              onChangeText={setCapacityKG}
              keyboardType="numeric"
            />
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-center text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            className="bg-blue-600 h-14 rounded-xl justify-center items-center mb-4 shadow-sm active:bg-blue-700"
            onPress={handleSubmit}>
            <Text className="text-white font-semibold text-lg">
              Simpan Truk
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Link */}
        <View className="items-center">
          <TouchableOpacity className="py-3 px-6" onPress={() => router.back()}>
            <Text className="text-gray-600 text-center text-base">
              <Text className="text-blue-600 font-medium">
                Kembali ke Daftar Truk
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
