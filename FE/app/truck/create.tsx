import { useTrucks } from "@/hooks/useTrucks";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function CreateTruck() {
  const { createTruck, isLoading } = useTrucks();
  const router = useRouter();

  const [form, setForm] = useState({
    license_plate: "",
    model: "",
    cargo_type: "",
    capacity_kg: 0,
    is_available: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (key: string, value: string | number | boolean) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setSubmitting(true);
      await createTruck(form);
      router.push("/(tabs)/truck");
    } catch (error) {
      console.error("Gagal membuat truk:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const insets = useSafeAreaInsets();
  return (
    <ScrollView
      style={{ paddingTop: insets.top }}
      className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
      <View className="flex-1 justify-center px-8 py-8">
        <View className="mb-8">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              onPress={() => router.back()}
              className="mr-4 p-2 rounded-full bg-white shadow-sm"
              disabled={isLoading}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <View className="flex-1">
              <Text className="text-3xl font-light text-gray-800 mb-1">
                Masukan Data Truk
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-1 px-4 py-6">
          <View className="bg-white rounded-2xl shadow-lg p-8">
            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Plat Nomor <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base"
                value={form.license_plate}
                onChangeText={(text) => handleChange("license_plate", text)}
                placeholder="B 1234 AB"
                placeholderTextColor="#9CA3AF"
                editable={!submitting}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Model <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base"
                value={form.model}
                onChangeText={(text) => handleChange("model", text)}
                placeholder="Hino, Toyota, etc"
                placeholderTextColor="#9CA3AF"
                editable={!submitting}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Jenis Muatan <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base"
                value={form.cargo_type}
                onChangeText={(text) => handleChange("cargo_type", text)}
                placeholder="Besi, Tanah, etc"
                placeholderTextColor="#9CA3AF"
                editable={!submitting}
              />
            </View>

            <View className="mb-6">
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Kapasitas (kg) <Text className="text-red-500">*</Text>
              </Text>
              <TextInput
                className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base"
                value={String(form.capacity_kg)}
                onChangeText={(text) =>
                  handleChange("capacity_kg", Number(text))
                }
                placeholder="1000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                editable={!submitting}
              />
            </View>

            <View className="mb-6 flex-row justify-between items-center">
              <Text className="text-sm font-medium text-gray-700">
                Tersedia <Text className="text-red-500">*</Text>
              </Text>
              <Switch
                value={form.is_available}
                onValueChange={(value) => handleChange("is_available", value)}
                disabled={submitting}
              />
            </View>

            <TouchableOpacity
              className="bg-blue-500 py-4 rounded-xl"
              onPress={handleSubmit}
              disabled={submitting}>
              <Text className="text-white text-center text-base font-semibold">
                {submitting ? "Menyimpan..." : "Simpan"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
