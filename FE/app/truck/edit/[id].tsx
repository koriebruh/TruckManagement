import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useEffect, useState } from "react";
import { useTrucks } from "@/hooks/useTrucks";
import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditTruckForm() {
  const { updateTruck, fetchTruckById } = useTrucks();
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    licensePlate: "",
    model: "",
    cargoType: "",
    capacityKG: "",
  });

  const [error, setError] = useState("");

  useEffect(() => {
    const loadTruck = async () => {
      try {
        const truck = await fetchTruckById(id);
        setForm({
          licensePlate: truck.licensePlate || "",
          model: truck.model || "",
          cargoType: truck.cargoType || "",
          capacityKG: truck.capacityKG?.toString() || "",
        });
      } catch (err: any) {
        setError("Gagal memuat data truk.");
      }
    };

    if (id) loadTruck();
  }, [id]);

  const handleChange = (key: keyof typeof form, value: string) => {
    setForm({ ...form, [key]: value });
  };

  const handleSubmit = async () => {
    if (
      !form.licensePlate ||
      !form.model ||
      !form.cargoType ||
      !form.capacityKG
    ) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    try {
      await updateTruck(id, {
        licensePlate: form.licensePlate,
        model: form.model,
        cargoType: form.cargoType,
        capacityKG: parseInt(form.capacityKG),
      });

      router.back();
    } catch (err: any) {
      setError(err.message || "Gagal mengupdate truk.");
    }
  };

  return (
    <ScrollView className="flex-1 bg-white px-4 py-6">
      <Text className="text-xl font-bold text-center mb-4">Edit Truck</Text>

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Nomor Plat</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={form.licensePlate}
          onChangeText={(text) => handleChange("licensePlate", text)}
          placeholder="B 1234 CD"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Model</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={form.model}
          onChangeText={(text) => handleChange("model", text)}
          placeholder="Tronton, Wingbox, dll"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-700 mb-2">Jenis Muatan (Cargo Type)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          value={form.cargoType}
          onChangeText={(text) => handleChange("cargoType", text)}
          placeholder="Barang, Cairan, dll"
        />
      </View>

      <View className="mb-6">
        <Text className="text-gray-700 mb-2">Kapasitas (kg)</Text>
        <TextInput
          className="border border-gray-300 rounded-lg px-4 py-2"
          keyboardType="numeric"
          value={form.capacityKG}
          onChangeText={(text) => handleChange("capacityKG", text)}
          placeholder="10000"
        />
      </View>

      <TouchableOpacity
        onPress={handleSubmit}
        className="bg-blue-600 rounded-lg py-3 items-center">
        <Text className="text-white text-base font-semibold">Perbarui</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
