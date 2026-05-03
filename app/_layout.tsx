// app/_layout.tsx — This controls where the app goes on launch

import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Stack, useRouter, useSegments } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";

function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();
  const { isAuthenticated, isLoading, user } = useAuth();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";
    const inTabsGroup = segments[0] === "(tabs)";
    const inPendingScreen = inAuthGroup && segments[1] === "pending";

    if (!isAuthenticated) {
      if (!inAuthGroup) {
        router.replace("/auth/login");
      }
      return;
    }

    if (user?.account_status === "pending" && !inPendingScreen) {
      router.replace("/auth/pending");
      return;
    }

    if (user?.account_status === "active" && inAuthGroup) {
      router.replace("/(tabs)");
      return;
    }
  }, [isAuthenticated, isLoading, segments, user?.account_status, router]);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return <>{children}</>;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="auth/login" options={{ headerShown: false }} />
          <Stack.Screen name="auth/register" options={{ headerShown: false }} />
          <Stack.Screen
            name="auth/verify-otp"
            options={{ headerShown: false }}
          />
          <Stack.Screen name="auth/pending" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="chatbot" options={{ headerShown: false }} />
          <Stack.Screen name="telemedicine" options={{ headerShown: false }} />
          <Stack.Screen name="queue" options={{ headerShown: false }} />
          <Stack.Screen name="events" options={{ headerShown: false }} />
        </Stack>
      </AuthGuard>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#eff6ff",
  },
});
