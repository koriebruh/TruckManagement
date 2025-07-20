import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useUsers } from "@/hooks/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const EditProfileUser = () => {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const {
    profile,
    updateProfile,
    isLoading,
    refetchProfile,
    error: queryError,
  } = useUsers();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    age: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (profile) {
      setForm({
        username: profile.username || "",
        email: profile.email || "",
        phone_number: profile.phone_number || "",
        age: String(profile.age || ""),
      });
    }
  }, [profile]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setLocalError(null);

    if (!form.username || !form.email || !form.phone_number || !form.age) {
      setLocalError("Semua kolom wajib diisi.");
      return;
    }

    const ageNum = parseInt(form.age);
    if (isNaN(ageNum) || ageNum <= 0) {
      setLocalError("Umur harus berupa angka yang valid.");
      return;
    }

    setSubmitting(true);
    try {
      await updateProfile({
        username: form.username.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        age: ageNum,
      });

      Alert.alert("Berhasil", "Profil berhasil diperbarui.");
      router.replace("/profile");
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Gagal memperbarui profil.";
      setLocalError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (isLoading || !profile) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Memuat data profil...</Text>
      </View>
    );
  }

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
              disabled={submitting}>
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-3xl font-light text-gray-800">
              Edit Profil
            </Text>
          </View>
        </View>

        <View className="bg-white rounded-2xl shadow-lg p-8">
          {/* Username (readonly) */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Username <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-100 border border-gray-200 rounded-xl px-4 text-gray-500 text-base"
              value={form.username}
              editable={false}
              placeholder="Masukkan username"
              placeholderTextColor="#9CA3AF"
            />
          </View>

          {/* Email */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Email <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.email}
              onChangeText={(text) => handleChange("email", text)}
              keyboardType="email-address"
              placeholder="Masukkan email"
              placeholderTextColor="#9CA3AF"
              editable={!submitting}
            />
          </View>

          {/* Nomor Telepon */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Nomor Telepon <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.phone_number}
              onChangeText={(text) => handleChange("phone_number", text)}
              keyboardType="phone-pad"
              placeholder="Masukkan nomor telepon"
              placeholderTextColor="#9CA3AF"
              editable={!submitting}
            />
          </View>

          {/* Umur */}
          <View className="mb-6">
            <Text className="text-sm font-medium text-gray-700 mb-2">
              Umur <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
              value={form.age}
              onChangeText={(text) => handleChange("age", text)}
              keyboardType="numeric"
              placeholder="Masukkan umur"
              placeholderTextColor="#9CA3AF"
              editable={!submitting}
            />
          </View>

          {localError || queryError ? (
            <View className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
              <Text className="text-red-600 text-center text-sm">
                {localError || (queryError as Error)?.message}
              </Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={submitting}
            className={`h-14 rounded-xl justify-center items-center shadow-sm ${
              submitting ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
            }`}>
            <Text className="text-white font-semibold text-lg">
              {submitting ? "Menyimpan..." : "Simpan"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default EditProfileUser;
