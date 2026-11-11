import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LanguageProvider } from "../context/LanguageContext";

export default function RootLayout() {
  return (
    <LanguageProvider>
      {/* Status bar styling */}
      <StatusBar style="dark" />

      {/* Main Stack: (tabs) containing the 4 bottom tabs + modal/stack screens */}
      <Stack
        screenOptions={{
          headerShown: false,
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="result" options={{ headerShown: false }} />
        <Stack.Screen name="saved-diseases" options={{ headerShown: false }} />
        <Stack.Screen name="reports" options={{ headerShown: false }} />
        <Stack.Screen name="how-it-works" options={{ headerShown: false }} />
        <Stack.Screen name="settings" options={{ headerShown: false }} />
        <Stack.Screen name="about" options={{ headerShown: false }} />
      </Stack>
    </LanguageProvider>
  );
}
