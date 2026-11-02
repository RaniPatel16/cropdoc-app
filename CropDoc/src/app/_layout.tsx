import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      {/* Green status bar text for the agriculture theme */}
      <StatusBar style="dark" />

      {/* Stack navigator — each screen slides in from the right */}
      <Stack
        screenOptions={{
          headerShown: false, // We build our own headers in each screen
          animation: "slide_from_right",
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="scan" />
        <Stack.Screen name="result" />
        <Stack.Screen name="history" />
      </Stack>
    </>
  );
}

