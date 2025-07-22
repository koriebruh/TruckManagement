import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useRoutes } from "@/hooks/useRoutes";

export default function EditRoutePage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { getRouteById, updateRoute } = useRoutes();

  const [form, setForm] = useState({
    startCityName: "",
    endCityName: "",
    details: "",
    distanceKM: "",
    estimatedDurationHours: "",
    basePrice: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      getRouteById(id)
        .then((data) => {
          setForm({
            startCityName: data.startCityName,
            endCityName: data.endCityName,
            details: data.details,
            distanceKM: String(data.distanceKM),
            estimatedDurationHours: String(data.estimatedDurationHours),
            basePrice: String(data.basePrice),
            isActive: data.isActive,
          });
        })
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleUpdate = async () => {
    try {
      await updateRoute(id, {
        ...form,
        distanceKM: Number(form.distanceKM),
        estimatedDurationHours: Number(form.estimatedDurationHours),
        basePrice: Number(form.basePrice),
      });
      Alert.alert("Sukses", "Rute berhasil diperbarui");
      router.back();
    } catch (error) {
      Alert.alert("Gagal", "Terjadi kesalahan saat memperbarui rute");
    }
  };

  if (loading) return <ActivityIndicator className="mt-10" size="large" />;

  return (
    <ScrollView className="p-4">
      <Text className="text-xl font-bold mb-4 text-center">Edit Rute</Text>

      {[
        { label: "Kota Awal", key: "startCityName" },
        { label: "Kota Tujuan", key: "endCityName" },
        { label: "Detail", key: "details" },
        { label: "Jarak (KM)", key: "distanceKM", keyboardType: "numeric" },
        {
          label: "Durasi (Jam)",
          key: "estimatedDurationHours",
          keyboardType: "numeric",
        },
        { label: "Harga Dasar", key: "basePrice", keyboardType: "numeric" },
      ].map(({ label, key, keyboardType }) => (
        <View className="mb-4" key={key}>
          <Text className="mb-1 font-semibold">{label}</Text>
          <TextInput
            value={form[key as keyof typeof form]}
            onChangeText={(text) => setForm({ ...form, [key]: text })}
            keyboardType={keyboardType}
            className="border rounded-xl px-3 py-2 bg-white"
          />
        </View>
      ))}

      {/* Toggle Status */}
      <TouchableOpacity
        className={`rounded-xl p-3 mb-4 ${
          form.isActive ? "bg-green-100" : "bg-red-100"
        }`}
        onPress={() => setForm({ ...form, isActive: !form.isActive })}>
        <Text className="text-center font-semibold">
          {form.isActive ? "Rute Aktif" : "Rute Nonaktif"}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="bg-blue-600 py-3 rounded-xl"
        onPress={handleUpdate}>
        <Text className="text-white text-center font-semibold">
          Simpan Perubahan
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
