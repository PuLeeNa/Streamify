import { icons } from "@/constants/icons";
import React from "react";
import { Image, Text, TextInput, View } from "react-native";
import { useTheme } from "@/contexts/ThemeContext";

interface Props {
  placeholder: string;
  onPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
}

const SearchBar = ({ onPress, placeholder, value, onChangeText }: Props) => {
  const { isDark } = useTheme();

  return (
    <View
      className={`flex-row items-center rounded-full px-5 py-4 ${
        isDark ? "bg-dark-200" : "bg-gray-200"
      }`}
    >
      <Image
        source={icons.search}
        className="size-5"
        resizeMode="contain"
        tintColor={isDark ? "#ab8bff" : "#6366f1"}
      />
      <TextInput
        onPress={onPress}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={isDark ? "#a8b5db" : "#9ca3af"}
        className={`flex-1 ml-2 ${isDark ? "text-white" : "text-black"}`}
      />
    </View>
  );
};

export default SearchBar;
