// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ActivityIndicator,
//   Alert,
//   ScrollView,
// } from "react-native";
// import React, { useEffect, useState } from "react";
// import { useUsers } from "@/hooks/useUser";
// import { Ionicons } from "@expo/vector-icons";
// import { useRouter } from "expo-router";
// import { useSafeAreaInsets } from "react-native-safe-area-context";

// const EditProfileUser = () => {
//   const router = useRouter();
//   const insets = useSafeAreaInsets();
//   const {
//     profile,
//     updateProfile,
//     isLoading,
//     refetchProfile,
//     error: queryError,
//   } = useUsers();

//   const [form, setForm] = useState({
//     username: "",
//     email: "",
//     phone_number: "",
//     age: "",
//   });

//   const [submitting, setSubmitting] = useState(false);
//   const [localError, setLocalError] = useState<string | null>(null);

//   useEffect(() => {
//     if (profile) {
//       setForm({
//         username: profile.username || "",
//         email: profile.email || "",
//         phone_number: profile.phone_number || "",
//         age: String(profile.age || ""),
//       });
//     }
//   }, [profile]);

//   const handleChange = (name: string, value: string) => {
//     setForm((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = async () => {
//     setLocalError(null);

//     if (!form.username || !form.email || !form.phone_number || !form.age) {
//       setLocalError("Semua kolom wajib diisi.");
//       return;
//     }

//     const ageNum = parseInt(form.age);
//     if (isNaN(ageNum) || ageNum <= 0) {
//       setLocalError("Umur harus berupa angka yang valid.");
//       return;
//     }

//     setSubmitting(true);
//     try {
//       await updateProfile({
//         username: form.username.trim(),
//         email: form.email.trim(),
//         phone_number: form.phone_number.trim(),
//         age: ageNum,
//       });

//       Alert.alert("Berhasil", "Profil berhasil diperbarui.");
//       router.replace("/profile");
//     } catch (err: any) {
//       const msg =
//         err?.response?.data?.message ||
//         err?.message ||
//         "Gagal memperbarui profil.";
//       setLocalError(msg);
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   if (isLoading || !profile) {
//     return (
//       <View className="flex-1 justify-center items-center">
//         <ActivityIndicator size="large" color="#2563eb" />
//         <Text className="mt-4 text-gray-600">Memuat data profil...</Text>
//       </View>
//     );
//   }

//   return (
//     <ScrollView
//       style={{ paddingTop: insets.top }}
//       className="flex-1 bg-gradient-to-br from-slate-50 to-gray-100">
//       <View className="flex-1 justify-center px-8 py-8">
//         <View className="mb-8">
//           <View className="flex-row items-center mb-4">
//             <TouchableOpacity
//               onPress={() => router.back()}
//               className="mr-4 p-2 rounded-full bg-white shadow-sm"
//               disabled={submitting}>
//               <Ionicons name="arrow-back" size={24} color="#374151" />
//             </TouchableOpacity>
//             <Text className="text-3xl font-light text-gray-800">
//               Edit Profil
//             </Text>
//           </View>
//         </View>

//         <View className="bg-white rounded-2xl shadow-lg p-8">
//           {/* Username (readonly) */}
//           <View className="mb-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Username <Text className="text-red-500">*</Text>
//             </Text>
//             <TextInput
//               className="h-14 bg-gray-100 border border-gray-200 rounded-xl px-4 text-gray-500 text-base"
//               value={form.username}
//               placeholder="Masukkan username"
//               placeholderTextColor="#9CA3AF"
//             />
//           </View>

//           {/* Email */}
//           <View className="mb-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Email <Text className="text-red-500">*</Text>
//             </Text>
//             <TextInput
//               className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
//               value={form.email}
//               onChangeText={(text) => handleChange("email", text)}
//               keyboardType="email-address"
//               placeholder="Masukkan email"
//               placeholderTextColor="#9CA3AF"
//               editable={!submitting}
//             />
//           </View>

//           {/* Nomor Telepon */}
//           <View className="mb-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Nomor Telepon <Text className="text-red-500">*</Text>
//             </Text>
//             <TextInput
//               className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
//               value={form.phone_number}
//               onChangeText={(text) => handleChange("phone_number", text)}
//               keyboardType="phone-pad"
//               placeholder="Masukkan nomor telepon"
//               placeholderTextColor="#9CA3AF"
//               editable={!submitting}
//             />
//           </View>

//           {/* Umur */}
//           <View className="mb-6">
//             <Text className="text-sm font-medium text-gray-700 mb-2">
//               Umur <Text className="text-red-500">*</Text>
//             </Text>
//             <TextInput
//               className="h-14 bg-gray-50 border border-gray-200 rounded-xl px-4 text-gray-800 text-base focus:border-blue-500 focus:bg-white"
//               value={form.age}
//               onChangeText={(text) => handleChange("age", text)}
//               keyboardType="numeric"
//               placeholder="Masukkan umur"
//               placeholderTextColor="#9CA3AF"
//               editable={!submitting}
//             />
//           </View>

//           {localError || queryError ? (
//             <View className="mb-6 bg-red-50 border border-red-200 rounded-lg p-3">
//               <Text className="text-red-600 text-center text-sm">
//                 {localError || (queryError as Error)?.message}
//               </Text>
//             </View>
//           ) : null}

//           <TouchableOpacity
//             onPress={handleSubmit}
//             disabled={submitting}
//             className={`h-14 rounded-xl justify-center items-center shadow-sm ${
//               submitting ? "bg-blue-400" : "bg-blue-600 active:bg-blue-700"
//             }`}>
//             <Text className="text-white font-semibold text-lg">
//               {submitting ? "Menyimpan..." : "Simpan"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </View>
//     </ScrollView>
//   );
// };

// export default EditProfileUser;

import React from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Ionicons } from "@expo/vector-icons";
import { useProfile, useUpdateProfile } from "@/hooks/useProfile";

// Zod validation schema
const updateProfileSchema = z.object({
  username: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .min(3, "Username minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh mengandung huruf, angka, dan underscore"
    ),
  email: z
    .string()
    .min(1, "Email tidak boleh kosong")
    .email("Format email tidak valid"),
  phone_number: z
    .string()
    .min(1, "Nomor telepon tidak boleh kosong")
    .min(10, "Nomor telepon minimal 10 digit")
    .regex(/^[0-9]+$/, "Nomor telepon hanya boleh mengandung angka"),
  age: z
    .string()
    .min(1, "Umur tidak boleh kosong")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 13 && num <= 120;
    }, "Umur harus antara 13-120 tahun"),
});

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;

const EditProfile = () => {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { data: profile_data, isLoading: profile_loading } = useProfile();
  const updateProfileMutation = useUpdateProfile();

  const profile = profile_data?.data;

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: profile?.username || "",
      email: profile?.email || "",
      phone_number: profile?.phone_number || "",
      age: profile?.age?.toString() || "",
    },
  });

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      const updateData = {
        username: data.username,
        email: data.email,
        phone_number: data.phone_number,
        age: parseInt(data.age),
      };

      await updateProfileMutation.mutateAsync(updateData);

      Alert.alert("Sukses", "Profil berhasil diperbarui!", [
        {
          text: "OK",
          onPress: () => router.back(),
        },
      ]);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Terjadi kesalahan saat memperbarui profil"
      );
    }
  };

  const renderInput = (
    name: keyof UpdateProfileFormData,
    label: string,
    placeholder: string,
    icon: string,
    props?: any
  ) => (
    <View className="mb-6">
      <Text className="text-sm font-medium text-gray-700 mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value } }) => (
          <View className="relative">
            <View className="absolute left-4 top-4 z-10">
              <Ionicons name={icon as any} size={20} color="#6B7280" />
            </View>
            <TextInput
              className={`h-14 bg-gray-50 border rounded-xl pl-12 pr-4 text-gray-800 text-base ${
                errors[name]
                  ? "border-red-300 focus:border-red-500"
                  : "border-gray-200 focus:border-blue-500 focus:bg-white"
              }`}
              placeholder={placeholder}
              placeholderTextColor="#9CA3AF"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              {...props}
            />
          </View>
        )}
      />
      {errors[name] && (
        <Text className="text-red-500 text-sm mt-1">
          {errors[name]?.message}
        </Text>
      )}
    </View>
  );

  if (profile_loading) {
    return (
      <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

        {/* Header */}
        <View className="bg-white px-6 py-4 border-b border-gray-200">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Edit Profil</Text>
          </View>
        </View>

        <View className="flex-1 justify-center items-center">
          <Text className="text-gray-500">Memuat data profil...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }} className="bg-gray-50">
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />

      {/* Header
      <View className="bg-white px-6 py-4 border-b border-gray-200">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Edit Profil</Text>
          </View>
        </View>
      </View> */}

      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 24,
          paddingHorizontal: 24,
          paddingTop: 24,
        }}
        showsVerticalScrollIndicator={false}>
        {/* Avatar Section */}
        <View className="items-center mb-8">
          <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-4 shadow-sm">
            <Text className="text-white text-3xl font-bold">
              {profile?.username?.charAt(0)?.toUpperCase() || "U"}
            </Text>
          </View>
          <Text className="text-lg font-semibold text-gray-800">
            Perbarui Informasi Profil
          </Text>
          <Text className="text-gray-500 text-sm text-center mt-1">
            Pastikan informasi yang Anda masukkan sudah benar
          </Text>
        </View>

        {/* Form */}
        <View className="bg-white rounded-2xl shadow-sm p-6 mb-6">
          {renderInput(
            "username",
            "Username",
            "Masukkan username Anda",
            "person-outline",
            {
              autoCapitalize: "none",
            }
          )}

          {renderInput(
            "email",
            "Email",
            "Masukkan email Anda",
            "mail-outline",
            {
              keyboardType: "email-address",
              autoCapitalize: "none",
            }
          )}

          {renderInput(
            "phone_number",
            "Nomor Telepon",
            "Masukkan nomor telepon Anda",
            "call-outline",
            {
              keyboardType: "numeric",
            }
          )}

          {renderInput(
            "age",
            "Umur",
            "Masukkan umur Anda",
            "calendar-outline",
            {
              keyboardType: "numeric",
            }
          )}

          {/* Submit Button */}
          <TouchableOpacity
            className={`h-14 rounded-xl justify-center items-center shadow-sm ${
              updateProfileMutation.isPending
                ? "bg-gray-400"
                : "bg-blue-600 active:bg-blue-700"
            }`}
            onPress={handleSubmit(onSubmit)}
            disabled={updateProfileMutation.isPending}>
            {updateProfileMutation.isPending ? (
              <View className="flex-row items-center">
                <Text className="text-white font-semibold text-lg mr-2">
                  Menyimpan...
                </Text>
              </View>
            ) : (
              <View className="flex-row items-center">
                <Ionicons name="save-outline" size={20} color="white" />
                <Text className="text-white font-semibold text-lg ml-2">
                  Simpan Perubahan
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Info Card */}
        <View className="bg-blue-50 rounded-2xl p-4 border border-blue-200">
          <View className="flex-row items-start">
            <Ionicons name="information-circle" size={20} color="#2563EB" />
            <View className="flex-1 ml-3">
              <Text className="text-blue-800 font-medium text-sm">
                Catatan Penting
              </Text>
              <Text className="text-blue-700 text-sm mt-1">
                Pastikan email yang Anda masukkan masih aktif dan dapat diakses
                untuk keperluan pemulihan akun.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditProfile;