// app/auth/pending.tsx

import { Colors } from "@/constants/colors";
import { useAuth } from "@/context/AuthContext";
import * as authApi from "@/services/api/auth";
import { useRouter } from "expo-router";
import React from "react";
import { Alert, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function PendingScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleCheckStatus = async () => {
    try {
      const profile = await authApi.getProfile();
      if (profile.account_status === "active") {
        router.replace("/(tabs)");
      } else if (profile.account_status === "rejected") {
        Alert.alert(
          "Hindi Aprubado",
          "Ang iyong rehistrasyon ay tinanggihan. Makipag-ugnayan sa RHU staff.",
          [{ text: "OK" }],
        );
      } else {
        Alert.alert(
          "Nakabinbin pa rin",
          "Hinihintay pa ang pag-apruba ng RHU staff. Subukan ulit mamaya.",
          [{ text: "OK" }],
        );
      }
    } catch {
      Alert.alert(
        "Error",
        "May problema sa pag-check ng status. Subukan muli mamaya.",
      );
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/auth/login");
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.emoji}>⏳</Text>

        <Text style={styles.title}>Nakabinbin ang Rehistrasyon</Text>

        <Text style={styles.subtitle}>Kamusta, {user?.first_name}!</Text>

        <Text style={styles.description}>
          Ang iyong account ay naisumite na at kasalukuyang{" "}
          <Text style={{ fontWeight: "700", color: Colors.primary }}>
            sinusuri ng RHU staff
          </Text>
          . Mangyaring maghintay ng 1-2 araw na trabaho.
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>📋 Ano ang susunod?</Text>
          <Text style={styles.infoItem}>
            1. Susuriin ng MHO Staff ang iyong mga dokumento
          </Text>
          <Text style={styles.infoItem}>
            2. Makatanggap ng SMS kapag naaprubahan
          </Text>
          <Text style={styles.infoItem}>3. I-login ulit ang iyong account</Text>
        </View>

        <TouchableOpacity
          style={styles.checkButton}
          onPress={handleCheckStatus}
        >
          <Text style={styles.checkButtonText}>🔄 Tingnan ang Status</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Lumabas (Logout)</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
    justifyContent: "center",
    padding: 24,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 28,
    alignItems: "center",
    elevation: 4,
  },
  emoji: { fontSize: 60, marginBottom: 16 },
  title: {
    fontSize: 20,
    fontWeight: "800",
    color: Colors.primaryDark,
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: { fontSize: 16, color: Colors.gray, marginBottom: 12 },
  description: {
    fontSize: 14,
    color: "#374151",
    textAlign: "center",
    lineHeight: 22,
    marginBottom: 20,
  },
  infoBox: {
    backgroundColor: "#eff6ff",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 20,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.primaryDark,
    marginBottom: 8,
  },
  infoItem: { fontSize: 13, color: "#374151", marginBottom: 4, lineHeight: 18 },
  checkButton: {
    backgroundColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    width: "100%",
    alignItems: "center",
    marginBottom: 12,
  },
  checkButtonText: { color: "white", fontWeight: "700", fontSize: 15 },
  logoutButton: {
    paddingVertical: 10,
  },
  logoutButtonText: { color: Colors.gray, fontSize: 14 },
});
