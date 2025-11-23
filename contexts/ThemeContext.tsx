import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type ThemeMode = "light" | "dark" | "system";

interface ThemeContextType {
  theme: "light" | "dark";
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemColorScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>("dark");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Load saved theme preference
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("themeMode");
        if (savedTheme) {
          setThemeModeState(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.error("Error loading theme:", error);
      }
    };
    loadTheme();
  }, []);

  useEffect(() => {
    // Determine actual theme based on mode
    if (themeMode === "system") {
      setTheme(systemColorScheme === "dark" ? "dark" : "light");
    } else {
      setTheme(themeMode);
    }
  }, [themeMode, systemColorScheme]);

  const setThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem("themeMode", mode);
      setThemeModeState(mode);
    } catch (error) {
      console.error("Error saving theme:", error);
    }
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        themeMode,
        setThemeMode,
        isDark: theme === "dark",
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
};
