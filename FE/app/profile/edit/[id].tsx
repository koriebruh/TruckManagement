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

const EditProfileUser = () => {
  const { profile, updateProfile, loading, error } = useUsers();

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone_number: "",
    age: "",
  });

  const [submitting, setSubmitting] = useState(false);

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
    if (!form.username || !form.email || !form.phone_number || !form.age) {
      Alert.alert("Error", "Semua field wajib diisi");
      return;
    }

    setSubmitting(true);
    try {
      const ageNum = parseInt(form.age);
      if (isNaN(ageNum) || ageNum <= 0) {
        throw new Error("Umur harus berupa angka lebih dari 0");
      }

      await updateProfile({
        username: form.username.trim(),
        email: form.email.trim(),
        phone_number: form.phone_number.trim(),
        age: ageNum,
      });

      Alert.alert("Berhasil", "Profil berhasil diperbarui");
    } catch (err: any) {
      Alert.alert("Gagal", err.message || "Gagal memperbarui profil");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="mt-4 text-gray-600">Memuat data profil...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-6">
        <Text className="text-red-500 text-center">{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#f8fafc",
        flexGrow: 1,
      }}>
      <Text className="text-2xl font-bold text-gray-800 mb-6">Edit Profil</Text>

      <InputField
        label="Username"
        value={form.username}
        onChangeText={(v) => handleChange("username", v)}
      />
      <InputField
        label="Email"
        value={form.email}
        onChangeText={(v) => handleChange("email", v)}
        keyboardType="email-address"
      />
      <InputField
        label="Telepon"
        value={form.phone_number}
        onChangeText={(v) => handleChange("phone_number", v)}
        keyboardType="phone-pad"
      />
      <InputField
        label="Umur"
        value={form.age}
        onChangeText={(v) => handleChange("age", v)}
        keyboardType="numeric"
      />

      <TouchableOpacity
        onPress={handleSubmit}
        disabled={submitting}
        className="bg-blue-600 mt-6 h-12 rounded-xl justify-center items-center shadow-md active:bg-blue-700">
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white font-semibold text-base">Simpan</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const InputField = ({
  label,
  value,
  onChangeText,
  keyboardType = "default",
}: {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  keyboardType?: "default" | "email-address" | "phone-pad" | "numeric";
}) => (
  <View className="mb-4">
    <Text className="text-sm text-gray-600 mb-2">{label}</Text>
    <TextInput
      value={value}
      onChangeText={onChangeText}
      keyboardType={keyboardType}
      className="border border-gray-300 rounded-lg px-4 py-3 bg-white text-gray-800"
      placeholder={`Masukkan ${label.toLowerCase()}`}
    />
  </View>
);

export default EditProfileUser;
