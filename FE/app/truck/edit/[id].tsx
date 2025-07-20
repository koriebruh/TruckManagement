import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Switch,
} from "react-native";
import { useEffect, useState } from "react";
import { useTrucks } from "@/hooks/useTrucks";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function EditTruckForm() {
  const { updateTruck, fetchTruckById } = useTrucks();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    cargoType: "",
    capacityKG: "",
    isAvailable: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadTruck = async () => {
      if (!id) {
        setError("ID truk tidak ditemukan.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔍 Fetching truck with ID:", id);
        const truck = await fetchTruckById(id);
        console.log("📦 Truck data received:", truck);

        setForm({
          licensePlate: truck.license_plate || "",
          model: truck.model || "",
          cargoType: truck.cargo_type || "",
          capacityKG: truck.capacity_kg?.toString() || "",
          isAvailable: truck.is_available ?? true,
        });
        setError("");
      } catch (err: any) {
        console.error("❌ Error fetching truck:", err);
        setError(err.message || "Gagal memuat data truk.");
      } finally {
        setLoading(false);
      }
    };

    loadTruck();
  }, [id]);

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
    const capacityKG = form.capacityKG.trim();

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

    if (capacity > 100000) {
      setError("Kapasitas tidak boleh lebih dari 100,000 kg.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const payload = {
        license_plate: licensePlate,
        model: model,
        cargo_type: cargoType,
        capacity_kg: capacity,
        is_available: form.isAvailable,
      };

      console.log(
        "🚚 Updating truck with payload:",
        JSON.stringify(payload, null, 2)
      );

      await updateTruck(id, payload);

      Alert.alert("Sukses", "Truk berhasil diperbarui.", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (err: any) {
      console.error("❌ Error updating truck:", err);
      const errorMessage = err.message || "Gagal mengupdate truk.";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 justify-center items-center bg-gradient-to-br from-slate-50 to-gray-100">
        <ActivityIndicator size="large" color="#3B82F6" />
        <Text className="mt-4 text-gray-600 text-lg">Memuat data truk...</Text>
      </View>
    );
  }

  // Error state
  if (error && !form.licensePlate) {
    return (
      <View style={{ paddingTop: insets.top }} className="flex-1 justify-center items-center bg-gradient-to-br from-slate-50 to-gray-100 px-6">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-xl font-semibold text-gray-900 text-center">
          Terjadi Kesalahan
        </Text>
        <Text className="mt-2 text-gray-600 text-center">{error}</Text>
        <TouchableOpacity
          className="mt-6 px-6 py-3 bg-blue-500 rounded-lg"
          onPress={() => router.back()}>
          <Text className="text-white font-semibold">Kembali</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={{ paddingTop: insets.top, paddingBottom: insets.bottom }} className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
      <View className="flex-1 px-6 py-8">
        {/* Header */}
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-white shadow-sm"
              disabled={submitting}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-light text-gray-800 mb-1">
                Edit Truk
              </Text>
              <Text className="text-base text-gray-500 font-light">
                Perbarui informasi truk {form.licensePlate}
              </Text>
            </View>
          </View>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-2xl shadow-lg p-6 mb-6">
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
              editable={!submitting}
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
              editable={!submitting}
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
              editable={!submitting}
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
              value={form.capacityKG}
              onChangeText={(text) => {
                const numericText = text.replace(/[^0-9.]/g, "");
                handleChange("capacityKG", numericText);
              }}
              placeholder="10000"
              placeholderTextColor="#9CA3AF"
              editable={!submitting}
            />
            <Text className="text-xs text-gray-500 mt-1">
              Masukkan dalam kilogram (contoh: 10000)
            </Text>
          </View>

          {/* Is Available Switch */}
          <View className="mb-6">
            <View className="flex-row justify-between items-center bg-gray-50 border border-gray-200 rounded-xl px-4 py-4">
              <View>
                <Text className="text-sm font-medium text-gray-700">
                  Status Ketersediaan
                </Text>
                <Text className="text-xs text-gray-500 mt-1">
                  Atur ketersediaan truk untuk pengiriman
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-sm text-gray-600 mr-3">
                  {form.isAvailable ? "Tersedia" : "Tidak Tersedia"}
                </Text>
                <Switch
                  value={form.isAvailable}
                  onValueChange={(val) => handleChange("isAvailable", val)}
                  trackColor={{ false: "#D1D5DB", true: "#3B82F6" }}
                  thumbColor="#FFFFFF"
                  disabled={submitting}
                />
              </View>
            </View>
          </View>

          {/* Error Message */}
          {error ? (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4">
              <View className="flex-row items-center">
                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                <Text className="text-red-600 text-sm ml-2 flex-1">
                  {error}
                </Text>
              </View>
            </View>
          ) : null}

          {/* Submit Button */}
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`h-14 rounded-xl justify-center items-center mb-4 shadow-sm ${
              submitting ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
            }`}>
            <View className="flex-row items-center">
              {submitting && (
                <ActivityIndicator
                  size="small"
                  color="white"
                  className="mr-2"
                />
              )}
              <Text className="text-white font-semibold text-lg">
                {submitting ? "Menyimpan..." : "Simpan Perubahan"}
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}
