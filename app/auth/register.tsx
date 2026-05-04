import { useAuth } from "@/context/AuthContext";
import * as authApi from "@/services/api/auth";
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

  const update = (field: keyof RegisterInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    if (!form.firstName || !form.lastName) {
      Alert.alert("Kulang", "Ilagay ang buong pangalan.");
      return false;
    }

    if (!/^09\d{9}$/.test(form.phone)) {
      Alert.alert("Mali", "Ilagay ang tamang phone number (09XXXXXXXXX).");
      return false;
    }

    if (!form.barangay) {
      Alert.alert("Kulang", "Ilagay ang barangay.");
      return false;
    }

    if (!form.birthdate) {
      Alert.alert("Kulang", "Ilagay ang birthdate.");
      return false;
    }

    if (form.pin.length < 4 || form.pin.length > 6) {
      Alert.alert("Mali", "PIN must be 4–6 digits.");
      return false;
    }

    if (form.pin !== pinConfirm) {
      Alert.alert("Error", "Hindi magkapareho ang PIN.");
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validate()) return;

    setLoading(true);

    try {
      await authApi.register(form);
      await login({ phone: form.phone, pin: form.pin });
      router.replace("/(tabs)");
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.response?.data?.message || "Failed to register",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.title}>Magrehistro</Text>

        <View style={styles.field}>
          <Text style={styles.label}>Unang Pangalan</Text>
          <TextInput
            style={styles.input}
            value={form.firstName}
            onChangeText={(v) => update("firstName", v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Apelyido</Text>
          <TextInput
            style={styles.input}
            value={form.lastName}
            onChangeText={(v) => update("lastName", v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Phone</Text>
          <TextInput
            style={styles.input}
            keyboardType="phone-pad"
            value={form.phone}
            onChangeText={(v) =>
              update("phone", v.replace(/\D/g, "").slice(0, 11))
            }
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Barangay</Text>
          <TextInput
            style={styles.input}
            value={form.barangay}
            onChangeText={(v) => update("barangay", v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Birthdate</Text>
          <TextInput
            style={styles.input}
            value={form.birthdate}
            onChangeText={(v) => update("birthdate", v)}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="number-pad"
            value={form.pin}
            onChangeText={(v) =>
              update("pin", v.replace(/\D/g, "").slice(0, 6))
            }
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Confirm PIN</Text>
          <TextInput
            style={styles.input}
            secureTextEntry
            keyboardType="number-pad"
            value={pinConfirm}
            onChangeText={(v) =>
              setPinConfirm(v.replace(/\D/g, "").slice(0, 6))
            }
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Register</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20 },
  field: { marginBottom: 12 },
  label: { marginBottom: 6, fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginTop: 20,
    backgroundColor: "#0D9488",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
});
