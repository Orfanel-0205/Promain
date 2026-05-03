import { useAuth } from "@/context/AuthContext";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.match(/^09\d{9}$/)) {
      Alert.alert(
        "Mali",
        "Ilagay ang tamang numero ng telepono (09XXXXXXXXX).",
      );
      return;
    }

    if (pin.length < 4) {
      Alert.alert("Mali", "Ilagay ang iyong PIN (4–6 digit).");
      return;
    }

    setLoading(true);
    try {
      await login({ phone, pin });
      router.replace("/");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Hindi makapag-login. Subukan muli.";
      Alert.alert("Error sa Pag-login", message);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = loading || phone.length !== 11 || pin.length < 4;

  return (
    <View style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backArrow}>←</Text>
      </Pressable>

      <Text style={styles.heading}>Mag-login</Text>
      <Text style={styles.subtitle}>
        I-login ang iyong account gamit ang iyong numero at PIN.
      </Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Numero ng Telepono</Text>
        <TextInput
          value={phone}
          onChangeText={(text) =>
            setPhone(text.replace(/\D/g, "").slice(0, 11))
          }
          placeholder="09XXXXXXXXX"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>PIN</Text>
        <TextInput
          value={pin}
          onChangeText={(text) => setPin(text.replace(/\D/g, "").slice(0, 6))}
          placeholder="4–6 digit"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          keyboardType="number-pad"
          style={styles.input}
        />
      </View>

      <Pressable
        onPress={handleLogin}
        disabled={isDisabled}
        style={[styles.loginButton, isDisabled && styles.buttonDisabled]}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Mag-login</Text>
        )}
      </Pressable>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Wala pang account?</Text>
        <Pressable onPress={() => router.push("/auth/register")}>
          <Text style={styles.footerLink}>Magrehistro</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 24,
    paddingTop: 56,
  },
  backButton: {
    marginBottom: 28,
    alignSelf: "flex-start",
  },
  backArrow: {
    fontSize: 20,
    color: "#0D9488",
  },
  heading: {
    fontSize: 32,
    fontWeight: "800",
    color: "#0F766E",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#0F766E",
    marginBottom: 28,
    lineHeight: 24,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 8,
    fontSize: 14,
    color: "#134E4A",
    fontWeight: "600",
  },
  input: {
    backgroundColor: "#ECFEFF",
    borderColor: "#A7F3D0",
    borderWidth: 1,
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 18,
    fontSize: 16,
    color: "#0F766E",
  },
  loginButton: {
    backgroundColor: "#0D9488",
    borderRadius: 20,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: "#FFFFFF",
    fontWeight: "700",
    fontSize: 16,
  },
  footerRow: {
    marginTop: 22,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  footerText: {
    color: "#0F766E",
    fontSize: 14,
  },
  footerLink: {
    color: "#0D9488",
    fontSize: 14,
    fontWeight: "700",
  },
});
