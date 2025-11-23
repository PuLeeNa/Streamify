import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [isLoading, setIsLoading] = useState(false);

  const { login } = useAuth();
  const { isDark } = useTheme();
  const router = useRouter();

  const validateForm = (): boolean => {
    const newErrors: { username?: string; password?: string } = {};

    // Username validation
    if (!username.trim()) {
      newErrors.username = "Username is required";
    } else if (username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 4) {
      newErrors.password = "Password must be at least 4 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const success = await login(username.trim(), password);

      if (success) {
        Alert.alert("Success", "Login successful!");
        router.replace("/(tabs)");
      } else {
        Alert.alert("Error", "Invalid username or password");
      }
    } catch (error) {
      Alert.alert("Error", "An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className={`flex-1 ${isDark ? "bg-primary" : "bg-white"}`}
    >
      <Image
        source={images.bg}
        className="flex-1 absolute w-full h-full z-0"
        resizeMode="cover"
        style={{ opacity: isDark ? 1 : 0.05 }}
      />

      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center px-8 py-12">
          {/* Logo and Title */}
          <View className="items-center mb-12">
            <Image source={icons.logo} className="w-20 h-16 mb-4" />
            <Text
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Welcome Back
            </Text>
            <Text
              className={`text-sm mt-2 ${
                isDark ? "text-light-300" : "text-gray-600"
              }`}
            >
              Sign in to continue
            </Text>
          </View>

          {/* Username Input */}
          <View className="mb-5">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-light-200" : "text-gray-700"
              }`}
            >
              Username
            </Text>
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 ${
                isDark ? "bg-dark-200" : "bg-gray-100"
              } ${errors.username ? "border-2 border-red-500" : ""}`}
            >
              <Image
                source={icons.person}
                className="size-5 mr-3"
                tintColor={isDark ? "#a8b5db" : "#6b7280"}
              />
              <TextInput
                placeholder="Enter your username"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={username}
                onChangeText={(text) => {
                  setUsername(text);
                  if (errors.username)
                    setErrors({ ...errors, username: undefined });
                }}
                className={`flex-1 ${isDark ? "text-white" : "text-black"}`}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.username && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.username}
              </Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-8">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-light-200" : "text-gray-700"
              }`}
            >
              Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 ${
                isDark ? "bg-dark-200" : "bg-gray-100"
              } ${errors.password ? "border-2 border-red-500" : ""}`}
            >
              <Image
                source={icons.lock}
                className="size-5 mr-3"
                tintColor={isDark ? "#a8b5db" : "#6b7280"}
              />
              <TextInput
                placeholder="Enter your password"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                secureTextEntry={!showPassword}
                className={`flex-1 ${isDark ? "text-white" : "text-black"}`}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Image
                  source={showPassword ? icons.eye : icons.eyeHide}
                  className="size-5"
                  tintColor={isDark ? "#a8b5db" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Login Button */}
          <TouchableOpacity
            className={`bg-accent rounded-xl py-4 items-center mb-6 ${
              isLoading ? "opacity-50" : ""
            }`}
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text className="text-white font-bold text-base">Login</Text>
            )}
          </TouchableOpacity>

          {/* Sign Up Link */}
          <View className="flex-row justify-center items-center">
            <Text className={`${isDark ? "text-light-300" : "text-gray-600"}`}>
              Don't have an account?{" "}
            </Text>
            <Link href="/register" asChild>
              <TouchableOpacity>
                <Text className="text-accent font-bold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Info Note */}
          <View
            className={`mt-8 p-4 rounded-xl ${
              isDark ? "bg-dark-200/50" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs text-center ${
                isDark ? "text-light-300" : "text-gray-600"
              }`}
            >
              Note: Use your TMDB account credentials to login. Don't have one?
              Create at themoviedb.org
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
