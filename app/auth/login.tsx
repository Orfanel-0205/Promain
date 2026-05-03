// app/auth/login.tsx
import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const LOGO_SOURCE = require("@/assets/images/logo.png");

export default function LoginScreen() {
  const router = useRouter();
  const {
    login,
    biometricAvailable,
    authenticateWithBiometric,
    loginWithToken,
  } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    const trimmedPhone = phone.replace(/\D/g, "");
    if (!trimmedPhone || trimmedPhone.length < 10) {
      Alert.alert("", "Pakilagay ang tamang numero ng telepono.");
      return;
    }
    if (!pin || pin.length < 4 || pin.length > 6) {
      Alert.alert("", "Ang PIN ay dapat 4 hanggang 6 na digit.");
      return;
    }
    setLoading(true);
    try {
      await login({ phone: trimmedPhone, pin });
    } catch (e: unknown) {
      const msg =
        e && typeof e === "object" && "response" in e
          ? (e as { response?: { data?: { message?: string } } }).response?.data
              ?.message
          : "Hindi makapag-login. Subukan muli.";
      Alert.alert("", msg || "Hindi makapag-login. Subukan muli.");
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    if (!biometricAvailable) return;
    const ok = await authenticateWithBiometric();
    if (!ok) return;
    const token = await SecureStore.getItemAsync("token");
    const storedUser = await SecureStore.getItemAsync("user");
    if (token && storedUser) {
      await loginWithToken(token, JSON.parse(storedUser));
    } else {
      Alert.alert(
        "",
        "Mag-log in muna gamit ang PIN para magamit ang fingerprint.",
      );
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 24}
    >
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={LOGO_SOURCE}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        {/* Title */}
        <Text style={styles.title}>Ka-agapay</Text>
        <Text style={styles.subtitle}>
          Malasiqui RHU – Sandalan Para Sa Kalusugan
        </Text>

        {/* Phone Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>Numero ng Telepono</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="09XXXXXXXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.input}
          />
        </View>

        {/* PIN Input */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>PIN (4–6 digit)</Text>
          <View style={styles.pinRow}>
            <TextInput
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, "").slice(0, 6))}
              placeholder="••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPin}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.pinInput}
            />
            <Pressable
              onPress={() => setShowPin(!showPin)}
              style={styles.eyeBtn}
            >
              <Ionicons
                name={showPin ? "eye-off" : "eye"}
                size={22}
                color="#0F766E"
              />
            </Pressable>
          </View>
        </View>

        {/* Login Button */}
        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.loginBtnText}>Mag-log in</Text>
          )}
        </Pressable>

        {/* Register Button */}
        <Pressable
          onPress={() => router.push("/auth/register")}
          style={styles.registerBtn}
        >
          <Text style={styles.registerBtnText}>Magrehistro</Text>
        </Pressable>

        {/* Biometric */}
        {biometricAvailable && (
          <Pressable onPress={handleBiometric} style={styles.biometricBtn}>
            <Ionicons name="finger-print" size={28} color="white" />
            <Text style={styles.biometricText}>Biometric scanner</Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F766E",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 28,
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  logo: {
    width: 130,
    height: 130,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#ffffff",
    textAlign: "center",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: "#CCFBF1",
    textAlign: "center",
    marginBottom: 36,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#ffffff",
    marginBottom: 8,
  },
  input: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
    borderWidth: 1,
    borderColor: "#5EEAD4",
  },
  pinRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#5EEAD4",
  },
  pinInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: "#0F172A",
  },
  eyeBtn: {
    paddingHorizontal: 14,
    paddingVertical: 14,
  },
  loginBtn: {
    backgroundColor: "#0D9488",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  loginBtnDisabled: {
    backgroundColor: "#6B7280",
    borderColor: "#9CA3AF",
  },
  loginBtnText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#ffffff",
  },
  registerBtn: {
    backgroundColor: "transparent",
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 14,
    borderWidth: 2,
    borderColor: "#ffffff",
  },
  registerBtnText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ffffff",
  },
  biometricBtn: {
    alignItems: "center",
    marginTop: 20,
    paddingVertical: 10,
  },
  biometricText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ffffff",
    marginTop: 6,
  },
});
