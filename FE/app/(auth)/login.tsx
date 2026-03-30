import { useLogin } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import { zodResolver } from "@hookform/resolvers/zod";
import { Feather } from "@expo/vector-icons";
import { useQueryClient } from "@tanstack/react-query";
import { Link, useRouter } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Animated,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "Username tidak boleh kosong")
    .min(3, "Username minimal 3 karakter"),
  password: z
    .string()
    .min(1, "Password tidak boleh kosong")
    .min(6, "Password minimal 6 karakter"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginScreen() {
  const router = useRouter();
  const { handleLogin, isLoading, error, clearError } = useLogin();
  const { data: profile, isLoading: isProfileLoading } = useProfile();
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const queryClient = useQueryClient();

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
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: "", password: "" },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      clearError();
      await handleLogin(data);
      await queryClient.invalidateQueries({ queryKey: ["user_profile"] });
      setLoginSuccess(true);
    } catch (err: unknown) {
      if (err && typeof err === "object" && "response" in err) {
        const maybeResponse = (err as any).response;
        const maybeDataErrors =
          maybeResponse?.data?.errors ??
          maybeResponse?.data ??
          (err as any).message;
        console.log("Login error handled by hook:", maybeDataErrors);
      } else if (err instanceof Error) {
        console.log("Login error handled by hook:", err.message);
      } else {
        console.log("Login error handled by hook:", String(err));
      }
    }
  };

  useEffect(() => {
    if (loginSuccess && !isProfileLoading && profile?.data) {
      if (profile.data.role === "OWNER") {
        router.replace("/(tabs)/owner/homeOwner");
      } else if (profile.data.role === "DRIVER") {
        router.replace("/(tabs)/driver/homeDriver");
      } else {
        router.replace("/(auth)/login");
      }
    }
  }, [loginSuccess, isProfileLoading, profile, router]);

  return (
    <View className="flex-1 bg-slate-50">

      {/* Top accent bar */}
      <View className="h-1.5 w-full" />

      <Animated.View
        className="flex-1 justify-center px-7"
        style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>

        {/* Brand / Logo */}
        <View className="items-center mb-10">
          <View className="w-16 h-16 bg-blue-600 rounded-2xl justify-center items-center mb-5 shadow-md">
            <Text className="text-white text-2xl font-bold">T</Text>
          </View>
          <Text className="text-3xl font-bold text-gray-800 tracking-tight">
            Selamat Datang
          </Text>
          <Text className="text-sm text-gray-400 mt-1.5 font-normal">
            Silakan masuk ke akun Anda
          </Text>
        </View>

        {/* Form Card */}
        <View className="bg-white rounded-3xl shadow-sm border border-gray-100 px-7 py-8 mb-5">

          {/* Username Input */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-600 mb-1.5">
              Username
            </Text>
            <Controller
              control={control}
              name="username"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`flex-row items-center h-14 bg-gray-50 border rounded-xl px-4 gap-3 ${
                    errors.username ? "border-red-400" : "border-gray-200"
                  }`}>
                  <Feather
                    name="user"
                    size={18}
                    color={errors.username ? "#f87171" : "#9CA3AF"}
                  />
                  <TextInput
                    className="flex-1 text-gray-800 text-base"
                    placeholder="Masukkan username Anda"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    autoCapitalize="none"
                  />
                </View>
              )}
            />
            {errors.username && (
              <Text className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.username.message}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-5">
            <Text className="text-sm font-semibold text-gray-600 mb-1.5">
              Password
            </Text>
            <Controller
              control={control}
              name="password"
              render={({ field: { onChange, onBlur, value } }) => (
                <View
                  className={`flex-row items-center h-14 bg-gray-50 border rounded-xl px-4 gap-3 ${
                    errors.password ? "border-red-400" : "border-gray-200"
                  }`}>
                  <Feather
                    name="lock"
                    size={18}
                    color={errors.password ? "#f87171" : "#9CA3AF"}
                  />
                  <TextInput
                    className="flex-1 text-gray-800 text-base"
                    placeholder="Masukkan password Anda"
                    placeholderTextColor="#9CA3AF"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    secureTextEntry={!showPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((prev) => !prev)}
                    activeOpacity={0.7}>
                    <Feather
                      name={showPassword ? "eye" : "eye-off"}
                      size={18}
                      color="#9CA3AF"
                    />
                  </TouchableOpacity>
                </View>
              )}
            />
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1.5 font-medium">
                {errors.password.message}
              </Text>
            )}
          </View>

          {error && (
            <View className="mb-5 bg-red-50 border border-red-200 rounded-xl p-3.5">
              <Text className="text-red-600 text-center text-sm font-medium">
                {typeof error === "string" ? error : String(error)}
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
              {isLoading ? "Masuk..." : "Masuk"}
            </Text>
          </TouchableOpacity>
        </View>

        {/* Register link */}
        <View className="items-center">
          <Link href="/register" asChild>
            <TouchableOpacity className="py-3 px-6">
              <Text className="text-gray-500 text-center text-sm">
                Belum punya akun?{" "}
                <Text className="text-blue-600 font-semibold">
                  Daftar di sini
                </Text>
              </Text>
            </TouchableOpacity>
          </Link>
        </View>

      </Animated.View>
    </View>
  );
}