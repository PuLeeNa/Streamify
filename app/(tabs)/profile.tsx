import React from "react";
import { View, Text, TouchableOpacity, Image, ScrollView } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";
import { icons } from "@/constants/icons";
import { images } from "@/constants/images";

const Profile = () => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const themeOptions = [
    { label: "Light", value: "light" as const },
    { label: "Dark", value: "dark" as const },
    { label: "System", value: "system" as const },
  ];

  return (
    <View className={`flex-1 ${isDark ? "bg-primary" : "bg-white"}`}>
      <Image
        source={images.bg}
        className="flex-1 absolute w-full z-0"
        resizeMode="cover"
        style={{ opacity: isDark ? 1 : 0.05 }}
      />

      <ScrollView className="flex-1 px-5">
        <View className="w-full flex-row justify-center mt-20 items-center mb-8">
          <Image source={icons.logo} className="w-12 h-10" />
          <Text
            className={`text-2xl font-bold ml-3 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            Settings
          </Text>
        </View>

        {/* Theme Section */}
        <View
          className={`p-4 rounded-xl mb-4 ${
            isDark ? "bg-dark-100/50" : "bg-gray-100"
          }`}
        >
          <View className="flex-row items-center mb-4">
            <Text
              className={`text-lg font-bold ${
                isDark ? "text-white" : "text-black"
              }`}
            >
              Appearance
            </Text>
          </View>

          <Text
            className={`text-sm mb-3 ${
              isDark ? "text-light-300" : "text-gray-600"
            }`}
          >
            Choose your preferred theme
          </Text>

          <View className="flex-row justify-between gap-x-3">
            {themeOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                className={`flex-1 py-3 px-4 rounded-lg items-center ${
                  themeMode === option.value
                    ? isDark
                      ? "bg-accent"
                      : "bg-blue-500"
                    : isDark
                    ? "bg-dark-100"
                    : "bg-gray-200"
                }`}
                onPress={() => setThemeMode(option.value)}
              >
                <Text
                  className={`font-semibold ${
                    themeMode === option.value
                      ? "text-white"
                      : isDark
                      ? "text-light-200"
                      : "text-gray-700"
                  }`}
                >
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text
            className={`text-xs mt-3 ${
              isDark ? "text-light-300" : "text-gray-500"
            }`}
          >
            {themeMode === "system"
              ? `Using ${theme} mode based on system settings`
              : `Currently using ${theme} mode`}
          </Text>
        </View>

        {/* App Info */}
        <View
          className={`p-4 rounded-xl ${
            isDark ? "bg-dark-100/50" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-lg font-bold mb-2 ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            About
          </Text>
          <Text
            className={`text-sm ${isDark ? "text-light-300" : "text-gray-600"}`}
          >
            Streamify - Your Movie Discovery App
          </Text>
          <Text
            className={`text-xs mt-2 ${
              isDark ? "text-light-300" : "text-gray-500"
            }`}
          >
            Version 1.0.0
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

export default Profile;
