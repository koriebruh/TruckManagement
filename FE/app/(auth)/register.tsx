import { useRegister } from "@/hooks/useAuth";
import { Feather } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Animated,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { z } from "zod";

const registerSchema = z.object({
  username: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .min(3, "Username minimal 3 karakter")
    .regex(
      /^[a-zA-Z0-9_]+$/,
      "Username hanya boleh mengandung huruf, angka, dan underscore"
    ),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong")
    .min(8, "Password minimal 8 karakter"),
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
    }),
});

type RegisterFormData = z.infer<typeof registerSchema>;

type FieldConfig = {
  name: keyof RegisterFormData;
  label: string;
  placeholder: string;
  icon: keyof typeof Feather.glyphMap;
  props?: any;
  isPassword?: boolean;
};

export default function RegisterScreen() {
  const router = useRouter();
  const { handleRegister, isLoading, error, clearError } = useRegister();
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      phone_number: "",
      age: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      clearError();
      const payload = { ...data, age: parseInt(data.age) };
      await handleRegister(payload);
      Alert.alert("Sukses", "Registrasi berhasil! Silakan login.", [
        { text: "OK", onPress: () => router.replace("/login") },
      ]);
    } catch (error: any) {
      console.log("Register error handled by hook:", error.message);
    }
  };

  const fields: FieldConfig[] = [
    {
      name: "username",
      label: "Username",
      placeholder: "Masukkan username Anda",
      icon: "user",
      props: { autoCapitalize: "none" },
    },
    {
      name: "email",
      label: "Email",
      placeholder: "Masukkan email Anda",
      icon: "mail",
      props: { keyboardType: "email-address", autoCapitalize: "none" },
    },
    {
      name: "password",
      label: "Password",
      placeholder: "Masukkan password Anda",
      icon: "lock",
      isPassword: true,
    },
    {
      name: "phone_number",
      label: "Nomor Telepon",
      placeholder: "Masukkan nomor telepon Anda",
      icon: "phone",
      props: { keyboardType: "numeric" },
    },
    {
      name: "age",
      label: "Umur",
      placeholder: "Masukkan umur Anda",
      icon: "calendar",
      props: { keyboardType: "numeric" },
    },
  ];

  return (
    <View style={{ paddingTop: insets.top }} className="flex-1 bg-slate-50">

      {/* Top accent bar */}
      <View className="h-1.5 w-full" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <Animated.View
          className="px-7 pt-10 pb-8"
          style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

          {/* Brand / Logo */}
          <View className="items-center mb-10">
            <View className="w-16 h-16 bg-blue-600 rounded-2xl justify-center items-center mb-5 shadow-md">
              <Text className="text-white text-2xl font-bold">T</Text>
            </View>
            <Text className="text-3xl font-bold text-gray-800 tracking-tight">
              Daftar Akun
            </Text>
            <Text className="text-sm text-gray-400 mt-1.5 font-normal">
              Buat akun baru untuk memulai
            </Text>
          </View>

          {/* Form Card */}
          <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-7 py-8 mb-5">

            {fields.map(({ name, label, placeholder, icon, isPassword, props }) => (
              <View key={name} className="mb-5">
                <Text className="text-sm font-semibold text-gray-600 mb-1.5">
                  {label}
                </Text>
                <Controller
                  control={control}
                  name={name}
                  render={({ field: { onChange, onBlur, value } }) => (
                    <View
                      className={`flex-row items-center h-14 bg-gray-50 border rounded-xl px-4 gap-3 ${
                        errors[name] ? "border-red-400" : "border-gray-200"
                      }`}>
                      <Feather
                        name={icon}
                        size={18}
                        color={errors[name] ? "#f87171" : "#9CA3AF"}
                      />
                      <TextInput
                        className="flex-1 text-gray-800 text-base"
                        placeholder={placeholder}
                        placeholderTextColor="#9CA3AF"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        secureTextEntry={isPassword && !showPassword}
                        {...props}
                      />
                      {isPassword && (
                        <TouchableOpacity
                          onPress={() => setShowPassword((prev) => !prev)}
                          activeOpacity={0.7}>
                          <Feather
                            name={showPassword ? "eye" : "eye-off"}
                            size={18}
                            color="#9CA3AF"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                  )}
                />
                {errors[name] && (
                  <Text className="text-red-500 text-xs mt-1.5 font-medium">
                    {errors[name]?.message}
                  </Text>
                )}
              </View>
            ))}

            {error && (
              <View className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5">
                <Text className="text-red-600 text-center text-sm font-medium">
                  {error}
                </Text>
              </View>
            )}

            <TouchableOpacity
              className={`h-14 rounded-2xl justify-center items-center mt-1 ${
                isLoading ? "bg-blue-300" : "bg-blue-600 active:bg-blue-700"
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
              activeOpacity={0.85}>
              <Text className="text-white font-bold text-base tracking-wide">
                {isLoading ? "Mendaftar..." : "Daftar"}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login link */}
          <View className="items-center">
            <Link href="/login" asChild>
              <TouchableOpacity className="py-3 px-6">
                <Text className="text-gray-500 text-center text-sm">
                  Sudah punya akun?{" "}
                  <Text className="text-blue-600 font-semibold">
                    Masuk di sini
                  </Text>
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

        </Animated.View>
      </ScrollView>
    </View>
  );
}