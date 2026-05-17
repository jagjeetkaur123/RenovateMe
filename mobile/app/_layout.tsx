import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light" />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth/login" options={{ title: "Sign In", headerBackVisible: false }} />
        <Stack.Screen name="auth/register" options={{ title: "Create Account" }} />
        <Stack.Screen name="jobs/new" options={{ title: "Post a Job" }} />
        <Stack.Screen name="trades/[category]" options={{ title: "Find Tradesperson" }} />
      </Stack>
    </>
  );
}
