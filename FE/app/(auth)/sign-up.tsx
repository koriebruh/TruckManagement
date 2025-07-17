import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View, Image } from "react-native";
import { useSignUp } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";

export default function SignUpScreen() {
  const { isLoaded, signUp, setActive } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const onSignUpPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.create({
        emailAddress,
        password,
        username: username.trim(), 
      });

      if (result.status === "complete") {
        await setActive({ session: result.createdSessionId });
        router.replace("/");
      } else {
        console.warn("Unexpected signup status:", result.status);
      }
    } catch (err) {
      console.error("Signup error", JSON.stringify(err, null, 2));
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-white px-6">
      <Image
        source={require("../../assets/images/logo.png")}
        className="w-40 h-40 mb-6"
        resizeMode="contain"
      />
      <Text className="text-2xl font-bold mb-4">Create Account</Text>

      <TextInput
        value={username}
        onChangeText={setUsername}
        placeholder="Username"
        autoCapitalize="none"
        className="border border-gray-300 w-full p-3 rounded mb-3"
      />

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
        onPress={onSignUpPress}
        className="bg-blue-600 w-full py-3 rounded mb-4">
        <Text className="text-white text-center font-semibold">Sign Up</Text>
      </TouchableOpacity>

      <View className="flex-row justify-center mt-2">
        <Text className="text-gray-600">Already have an account? </Text>
        <Link href="/sign-in">
          <Text className="text-blue-600 font-semibold">Sign In</Text>
        </Link>
      </View>
    </View>
  );
}
