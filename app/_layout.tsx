import { Stack } from "expo-router";
import "./globals.css";
import { StatusBar } from "react-native";
import { ThemeProvider } from "@/contexts/ThemeContext";

export default function RootLayout() {
  return (
    <ThemeProvider>
      <StatusBar hidden={true} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="movies/[id]" options={{ headerShown: false }} />
      </Stack>
    </ThemeProvider>
  );
}
