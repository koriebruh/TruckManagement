import { useCities } from "@/hooks/useCities";
import { useRoutes } from "@/hooks/useRoutes";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";

export default function CreateRoute() {
  const { cities, isLoading: loadingCities } = useCities();
  const { createRoute } = useRoutes();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [searchStart, setSearchStart] = useState("");
  const [searchEnd, setSearchEnd] = useState("");
  const [showStartModal, setShowStartModal] = useState(false);
  const [showEndModal, setShowEndModal] = useState(false);

  const [form, setForm] = useState({
    startCityId: 0,
    endCityId: 0,
    details: "",
    basePrice: 0,
    isActive: true,
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.startCityId || !form.endCityId) {
      alert("Pilih kota awal dan tujuan");
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        start_city_id: form.startCityId,
        end_city_id: form.endCityId,
        details: form.details,
        base_price: form.basePrice,
        is_active: form.isActive,
      };
      await createRoute(payload);
      router.push("/(tabs)/route");
    } catch (e: any) {
      console.error("🚨 Gagal membuat rute:", e.response?.data || e.message);
      alert(
        "Error: " +
          JSON.stringify(e.response?.data?.errors || e.message, null, 2)
      );
    } finally {
      setSubmitting(false);
    }
  };

  const renderCityModal = (
    label: string,
    selectedId: number,
    setId: (id: number) => void,
    modalVisible: boolean,
    setModalVisible: (visible: boolean) => void,
    search: string,
    setSearch: (value: string) => void
  ) => (
    <>
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        className="h-12 bg-gray-100 border border-gray-300 rounded-xl px-4 justify-center mb-6">
        <Text className="text-gray-800">
          {selectedId
            ? cities?.find((c) => c.id === selectedId)?.name
            : "Pilih kota"}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: "#00000080",
            justifyContent: "center",
          }}
          activeOpacity={1}
          onPressOut={() => setModalVisible(false)}>
          <View
            style={{
              margin: 20,
              backgroundColor: "white",
              borderRadius: 12,
              padding: 16,
              maxHeight: "60%",
            }}>
            <TextInput
              placeholder="Cari kota..."
              className="h-10 bg-gray-50 px-3 mb-4 rounded-md border border-gray-200"
              onChangeText={setSearch}
              value={search}
            />
            <ScrollView>
              {loadingCities ? (
                <ActivityIndicator />
              ) : (
                cities
                  ?.filter((c) =>
                    c.name.toLowerCase().includes(search.toLowerCase())
                  )
                  .map((city) => (
                    <TouchableOpacity
                      key={city.id}
                      onPress={() => {
                        setId(city.id);
                        setModalVisible(false);
                      }}
                      className="px-3 py-2 rounded-md">
                      <Text>{city.name}</Text>
                    </TouchableOpacity>
                  ))
              )}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );

  return (
    <ScrollView
      style={{ paddingTop: insets.top + 20 }}
      className="flex-1 bg-slate-50 px-6 pt-4">
      <View className="mb-6 flex-row items-center">
        <TouchableOpacity
          onPress={() => router.back()}
          className="mr-4 p-2 rounded-full bg-white shadow">
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text className="text-2xl font-bold text-gray-800">Tambah Rute</Text>
      </View>

      <View className="bg-white rounded-2xl shadow-lg p-6">
        {renderCityModal(
          "Kota Awal",
          form.startCityId,
          (id) => setForm({ ...form, startCityId: id }),
          showStartModal,
          setShowStartModal,
          searchStart,
          setSearchStart
        )}
        {renderCityModal(
          "Kota Tujuan",
          form.endCityId,
          (id) => setForm({ ...form, endCityId: id }),
          showEndModal,
          setShowEndModal,
          searchEnd,
          setSearchEnd
        )}

        <View className="mb-4">
          <Text className="mb-2">Detail (opsional)</Text>
          <TextInput
            value={form.details}
            onChangeText={(d) => setForm({ ...form, details: d })}
            placeholder="Lewat tol, via A"
            className="h-12 bg-gray-100 rounded-xl px-4"
          />
        </View>

        <View className="mb-4">
          <Text className="mb-2">Harga Dasar</Text>
          <TextInput
            value={String(form.basePrice)}
            onChangeText={(t) =>
              setForm({ ...form, basePrice: Number(t.replace(/\D/g, "")) })
            }
            placeholder="100000"
            keyboardType="numeric"
            className="h-12 bg-gray-100 rounded-xl px-4"
          />
        </View>

        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-sm font-medium text-gray-700">Aktif?</Text>
          <Switch
            value={form.isActive}
            onValueChange={(v) => setForm({ ...form, isActive: v })}
          />
        </View>

        <TouchableOpacity
          className="bg-blue-600 py-4 rounded-xl"
          onPress={handleSubmit}
          disabled={submitting}>
          <Text className="text-center text-white font-semibold text-base">
            {submitting ? "Menyimpan..." : "Simpan Rute"}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
