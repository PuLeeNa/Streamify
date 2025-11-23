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
  Linking,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { useTheme } from "@/contexts/ThemeContext";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { isDark } = useTheme();
  const router = useRouter();

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};

    // Username validation
    if (!formData.username.trim()) {
      newErrors.username = "Username is required";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username must be at least 3 characters";
    } else if (!/^[a-zA-Z0-9_]+$/.test(formData.username)) {
      newErrors.username =
        "Username can only contain letters, numbers, and underscores";
    }

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    // Password validation
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password =
        "Password must contain uppercase, lowercase, and number";
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (!validateForm()) return;

    Alert.alert(
      "Create TMDB Account",
      "To use this app, you need a TMDB account. Would you like to create one now on themoviedb.org?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Create Account",
          onPress: () => {
            Linking.openURL("https://www.themoviedb.org/signup");
          },
        },
        {
          text: "Already Have Account",
          onPress: () => {
            router.replace("/login");
          },
        },
      ]
    );
  };

  const updateField = (field: keyof typeof formData, value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: undefined });
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
          <View className="items-center mb-8">
            <Image source={icons.logo} className="w-20 h-16 mb-4" />
            <Text
              className={`text-3xl font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Create Account
            </Text>
            <Text
              className={`text-sm mt-2 ${
                isDark ? "text-light-300" : "text-gray-600"
              }`}
            >
              Sign up to get started
            </Text>
          </View>

          {/* Username Input */}
          <View className="mb-4">
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
                placeholder="Choose a username"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={formData.username}
                onChangeText={(text) => updateField("username", text)}
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

          {/* Email Input */}
          <View className="mb-4">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-light-200" : "text-gray-700"
              }`}
            >
              Email
            </Text>
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 ${
                isDark ? "bg-dark-200" : "bg-gray-100"
              } ${errors.email ? "border-2 border-red-500" : ""}`}
            >
              <Image
                source={icons.email}
                className="size-5 mr-3"
                tintColor={isDark ? "#a8b5db" : "#6b7280"}
              />
              <TextInput
                placeholder="Enter your email"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={formData.email}
                onChangeText={(text) => updateField("email", text)}
                className={`flex-1 ${isDark ? "text-white" : "text-black"}`}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
            {errors.email && (
              <Text className="text-red-500 text-xs mt-1">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="mb-4">
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
                placeholder="Create a password"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={formData.password}
                onChangeText={(text) => updateField("password", text)}
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

          {/* Confirm Password Input */}
          <View className="mb-6">
            <Text
              className={`text-sm font-medium mb-2 ${
                isDark ? "text-light-200" : "text-gray-700"
              }`}
            >
              Confirm Password
            </Text>
            <View
              className={`flex-row items-center rounded-xl px-4 py-3 ${
                isDark ? "bg-dark-200" : "bg-gray-100"
              } ${errors.confirmPassword ? "border-2 border-red-500" : ""}`}
            >
              <Image
                source={icons.lock}
                className="size-5 mr-3"
                tintColor={isDark ? "#a8b5db" : "#6b7280"}
              />
              <TextInput
                placeholder="Confirm your password"
                placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
                value={formData.confirmPassword}
                onChangeText={(text) => updateField("confirmPassword", text)}
                secureTextEntry={!showConfirmPassword}
                className={`flex-1 ${isDark ? "text-white" : "text-black"}`}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Image
                  source={showConfirmPassword ? icons.eye : icons.eyeHide}
                  className="size-5"
                  tintColor={isDark ? "#a8b5db" : "#6b7280"}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="text-red-500 text-xs mt-1">
                {errors.confirmPassword}
              </Text>
            )}
          </View>

          {/* Register Button */}
          <TouchableOpacity
            className="bg-accent rounded-xl py-4 items-center mb-6"
            onPress={handleRegister}
          >
            <Text className="text-white font-bold text-base">Sign Up</Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View className="flex-row justify-center items-center">
            <Text className={`${isDark ? "text-light-300" : "text-gray-600"}`}>
              Already have an account?{" "}
            </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-accent font-bold">Login</Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Info Note */}
          <View
            className={`mt-6 p-4 rounded-xl ${
              isDark ? "bg-dark-200/50" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs text-center ${
                isDark ? "text-light-300" : "text-gray-600"
              }`}
            >
              Note: This app requires a TMDB account. We'll redirect you to
              themoviedb.org to create one.
            </Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Register;
