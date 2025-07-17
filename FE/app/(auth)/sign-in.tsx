import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React from "react";

export default function SignInScreen() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;
    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image
        source={require("../../assets/images/logo.png")} // Pastikan kamu punya file ini
        className="w-40 h-40 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold mb-4">Welcome Back</Text>

      <TextInput
        value={emailAddress}
        onChangeText={setEmailAddress}
        placeholder="Email"
        autoCapitalize="none"
        className="border border-gray-300 w-full p-3 rounded mb-3"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        secureTextEntry
        className="border border-gray-300 w-full p-3 rounded mb-4"
      />

      <TouchableOpacity
        onPress={onSignInPress}
        className="bg-blue-600 w-full py-3 rounded mb-4">
        <Text className="text-white text-center font-semibold">Sign In</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-2">
        <Text className="text-gray-600">Don&apos;t have an account? </Text>
        <Link href="/sign-up">
          <Text className="text-blue-600 font-semibold">Sign Up</Text>
        </Link>
      </View>
    </View>
  );
}
