import * as authApi from "@/services/api/auth";
import { useAuth } from "@/context/AuthContext";
import type { RegisterInput } from "@/types";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [form, setForm] = useState<RegisterInput>({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    email: "",
    barangay: "",
    birthdate: "",
    sex: "male",
    isSeniorOrPwd: false,
    pin: "",
  });
  const [pinConfirm, setPinConfirm] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field: keyof RegisterInput, value: string | boolean) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.firstName.trim() || !form.lastName.trim()) {
      Alert.alert("Kulang", "Ilagay ang iyong buong pangalan.");
      return false;
    }
    if (!/^09\d{9}$/.test(form.phone)) {
      Alert.alert(
        "Mali",
        "Ilagay ang wastong numero ng telepono (09XXXXXXXXX).",
      );
      return false;
    }
    if (!form.barangay.trim()) {
      Alert.alert("Kulang", "Ilagay ang iyong barangay.");
      return false;
    }
    if (!form.birthdate.trim()) {
      Alert.alert("Kulang", "Ilagay ang iyong petsa ng kapanganakan.");
      return false;
    }
    if (!form.pin || form.pin.length < 4 || form.pin.length > 6) {
      Alert.alert("Mali", "Gumawa ng PIN na 4 hanggang 6 na digit.");
      return false;
    }
    if (form.pin !== pinConfirm) {
      Alert.alert("Hindi tugma", "Hindi magkapareho ang PIN at kumpirmasyon.");
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await authApi.register({
        firstName: form.firstName.trim(),
        middleName: form.middleName?.trim() ?? "",
        lastName: form.lastName.trim(),
        phone: form.phone.trim(),
        email: form.email?.trim() || undefined,
        barangay: form.barangay.trim(),
        birthdate: form.birthdate.trim(),
        sex: form.sex,
        isSeniorOrPwd: form.isSeniorOrPwd,
        pin: form.pin,
      });
      await login({ phone: form.phone.trim(), pin: form.pin });
      router.replace("/(tabs)");
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0] ||
        error?.message ||
        "Hindi maiproseso ang rehistrasyon. Subukan muli.";
      Alert.alert("Error sa Rehistrasyon", String(message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Magrehistro</Text>
        <Text style={styles.subtitle}>
          Kumpletuhin ang impormasyon para makagawa ng account.
        </Text>

        <View style={styles.field}>
          <Text style={styles.label}>Unang Pangalan</Text>
          <TextInput
            value={form.firstName}
            onChangeText={(value) => update("firstName", value)}
            placeholder="Unang pangalan"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Gitnang Pangalan (opsyonal)</Text>
          <TextInput
            value={form.middleName}
            onChangeText={(value) => update("middleName", value)}
            placeholder="Gitnang pangalan"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apelyido</Text>
          <TextInput
            value={form.lastName}
            onChangeText={(value) => update("lastName", value)}
            placeholder="Apelyido"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Numero ng Telepono</Text>
          <TextInput
            value={form.phone}
            onChangeText={(value) =>
              update("phone", value.replace(/\D/g, "").slice(0, 11))
            }
            placeholder="09XXXXXXXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Barangay</Text>
          <TextInput
            value={form.barangay}
            onChangeText={(value) => update("barangay", value)}
            placeholder="Barangay"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Kapanganakan</Text>
          <TextInput
            value={form.birthdate}
            onChangeText={(value) => update("birthdate", value)}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Kasarian</Text>
          <TextInput
            value={form.sex}
            onChangeText={(value) => update("sex", value as any)}
            placeholder="male / female / other"
            placeholderTextColor="#94A3B8"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PIN</Text>
          <TextInput
            value={form.pin}
            onChangeText={(value) =>
              update("pin", value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="4–6 digit"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Ulitin ang PIN</Text>
          <TextInput
            value={pinConfirm}
            onChangeText={(value) =>
              setPinConfirm(value.replace(/\D/g, "").slice(0, 6))
            }
            placeholder="Ulitin ang PIN"
            placeholderTextColor="#94A3B8"
            secureTextEntry
            keyboardType="number-pad"
            style={styles.input}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading}
          style={[styles.button, loading && styles.buttonDisabled]}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Tapusin ang Rehistrasyon</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/auth/login")}
          style={styles.loginLink}
        >
          <Text style={styles.loginText}>
            Mayroon nang account?{" "}
            <Text style={styles.loginTextBold}>Mag-login dito</Text>
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#FFFFFF" },
  content: { padding: 24, paddingBottom: 40 },
  title: { fontSize: 28, fontWeight: "800", color: "#0F766E", marginBottom: 8 },
  subtitle: { fontSize: 15, color: "#115E59", marginBottom: 24 },
  field: { marginBottom: 16 },
  label: { marginBottom: 8, color: "#094A46", fontWeight: "600" },
  input: {
    backgroundColor: "#F0FDFA",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#99F6E4",
    padding: 14,
    color: "#0F766E",
  },
  button: {
    backgroundColor: "#0F766E",
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    marginTop: 8,
  },
  buttonDisabled: { opacity: 0.6 },
  buttonText: { color: "#FFFFFF", fontWeight: "700", fontSize: 16 },
  loginLink: { marginTop: 20, alignItems: "center" },
  loginText: { color: "#0F766E", fontSize: 14 },
  loginTextBold: { fontWeight: "700" },
});
