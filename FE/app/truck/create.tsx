import { useTrucks } from "@/hooks/useTrucks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function CreateTruck() {
  const { createTruck } = useTrucks();
  const router = useRouter();

  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    cargoType: "",
    capacityKG: 0,
    isAvailable: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error ketika user mulai mengetik
    if (error) setError("");
  };

  const handleSubmit = async () => {
    // Validasi input dengan trim
    const licensePlate = form.licensePlate.trim();
    const model = form.model.trim();
    const cargoType = form.cargoType.trim();
    const capacityKG = form.capacityKG;
    const isAvailable = form.isAvailable;

    if (!licensePlate || !model || !cargoType || !capacityKG) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    // Validasi panjang string sesuai constraint backend
    if (licensePlate.length > 20) {
      setError("Nomor plat tidak boleh lebih dari 20 karakter.");
      return;
    }

    if (model.length > 50) {
      setError("Model tidak boleh lebih dari 50 karakter.");
      return;
    }

    if (cargoType.length > 100) {
      setError("Jenis muatan tidak boleh lebih dari 100 karakter.");
      return;
    }

    // Validasi kapasitas harus berupa angka positif
    const capacity = parseFloat(capacityKG);
    if (isNaN(capacity) || capacity <= 0) {
      setError(
        "Kapasitas harus berupa angka yang valid dan lebih besar dari 0."
      );
      return;
    }

    // Validasi maksimum kapasitas (opsional, sesuaikan kebutuhan)
    if (capacity > 100000) {
      setError("Kapasitas tidak boleh lebih dari 100,000 kg.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Payload yang akan dikirim - pastikan tipe data sesuai
       const payload = {
         license_plate: licensePlate,
         model,
         cargo_type: cargoType,
         capacity_kg: Number(capacityKG),
         is_available: isAvailable,
       };

      console.log(
        "🚚 Payload yang akan dikirim:",
        JSON.stringify(payload, null, 2)
      );

      await createTruck(payload);

      // Reset form setelah sukses
      setForm({
        licensePlate: "",
        model: "",
        cargoType: "",
        capacityKG: 0,
        isAvailable: true,
      });

      Alert.alert("Sukses", "Truk berhasil ditambahkan.", [
        {
          text: "OK",
          onPress: () => router.replace("/truck"),
        },
      ]);
    } catch (err: any) {
      console.error("❌ DETAIL ERROR: ", {
        message: err.message,
        stack: err.stack,
      });

      const errorMessage = err.message || "Gagal menambahkan truk.";
      setError(errorMessage);

      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
      <View className="flex-1 justify-center px-8 py-8">
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-white shadow-sm"
              disabled={loading}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-light text-gray-800 mb-1">
                Masukan Data Truk
              </Text>
            </View>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          {/* License Plate */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Nomor Plat <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.licensePlate}
              onChangeText={(text) => handleChange("licensePlate", text)}
              placeholder="B 1234 CD"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="characters"
              maxLength={20}
              editable={!loading}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Maksimal 20 karakter
            </Text>
          </View>

          {/* Model */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Model <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.model}
              onChangeText={(text) => handleChange("model", text)}
              placeholder="Canter, Dutro, dll"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              maxLength={50}
              editable={!loading}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Maksimal 50 karakter
            </Text>
          </View>

          {/* Cargo Type */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Jenis Muatan <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.cargoType}
              onChangeText={(text) => handleChange("cargoType", text)}
              placeholder="Barang Umum, Bahan Kimia, dll"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              maxLength={100}
              editable={!loading}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Maksimal 100 karakter
            </Text>
          </View>

          {/* Capacity */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Kapasitas (kg) <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              keyboardType="numeric"
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.capacityKG.toString()}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9.]/g, "");
                const number = parseFloat(numericText) || 0;
                handleChange("capacityKG", number);
              }}
              placeholder="10000"
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Masukkan dalam kilogram (contoh: 10000)
            </Text>
          </View>

          {/* Is Available Switch */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
              <Text className="text-sm font-medium text-gray-700">
                Status Ketersediaan
              </Text>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-600 mr-3">
                  {form.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                </Text>
                <Switch
                  value={form.isAvailable}
                  onValueChange={(val) => handleChange("isAvailable", val)}
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                  thumbColor={form.isAvailable ? "#FFFFFF" : "#FFFFFF"}
                  disabled={loading}
                />
              </View>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-center text-sm">{error}</Text>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`h-14 rounded-xl justify-center items-center mb-4 shadow-sm ${
              loading ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
            }`}>
            <Text className="text-white font-semibold text-lg">
              {loading ? "Menyimpan..." : "Simpan"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Back Link */}
        <View className="items-center">
          <TouchableOpacity
            className="py-3 px-6"
            onPress={() => router.back()}
            disabled={loading}>
            <Text
              className={`text-center text-base ${
                loading ? "text-gray-400" : "text-gray-600"
              }`}>
              <Text
                className={`font-medium ${
                  loading ? "text-gray-400" : "text-blue-600"
                }`}>
                Kembali ke Daftar Truk
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
