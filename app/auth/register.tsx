// app/auth/register.tsx
import type { RegisterInput, Sex } from "@/types";
import { BARANGAYS_MALASIQUI, SEX_OPTIONS } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const STEPS = 4;

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterInput>({
    firstName: "",
    middleName: "",
    lastName: "",
    phone: "",
    barangay: "",
    birthdate: "",
    sex: "male",
    isSeniorOrPwd: false,
    pin: "",
  });
  const [pinConfirm, setPinConfirm] = useState("");
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);

  const update = (k: keyof RegisterInput, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const canNextStep1 =
    form.firstName.trim() &&
    form.lastName.trim() &&
    form.phone.replace(/\D/g, "").length >= 10;
  const canNextStep2 = form.barangay && form.birthdate && form.sex;
  const canNextStep3 =
    form.pin.length >= 4 && form.pin.length <= 6 && form.pin === pinConfirm;

  const handleProceedToVerification = () => {
    if (!canNextStep3) {
      Alert.alert(
        "",
        "Tiyaking 4–6 digit ang PIN at magkapareho ang PIN at kumpirmasyon.",
      );
      return;
    }
    setStep(4);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white" // Using NativeWind classes
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "center",
          padding: 24,
          paddingBottom: 48,
        }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => (step > 1 ? setStep(step - 1) : router.back())}
          >
            <Ionicons name="arrow-back" size={28} color="#0D9488" />
          </Pressable>
          <Text className="text-xl font-bold text-teal-800">
            Magrehistro – Hakbang {step}/{STEPS}
          </Text>
        </View>

        {step === 1 && (
          <>
            <Text className="text-base text-teal-600 mb-4">
              Pangalan at numero ng telepono
            </Text>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Unang pangalan
              </Text>
              <TextInput
                value={form.firstName}
                onChangeText={(t) => update("firstName", t)}
                placeholder="Unang pangalan"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Gitnang pangalan (opsyonal)
              </Text>
              <TextInput
                value={form.middleName}
                onChangeText={(t) => update("middleName", t)}
                placeholder="Gitnang pangalan"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Apelyido
              </Text>
              <TextInput
                value={form.lastName}
                onChangeText={(t) => update("lastName", t)}
                placeholder="Apelyido"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Numero ng telepono
              </Text>
              <TextInput
                value={form.phone}
                onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                placeholder="09XXXXXXXXX"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={11}
                style={styles.input}
              />
            </View>
            <Pressable
              onPress={() => setStep(2)} // Using NativeWind classes
              disabled={!canNextStep1}
              style={[styles.button, !canNextStep1 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-base text-teal-600 mb-4">
              Barangay, kapanganakan, at kasarian
            </Text>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Barangay
              </Text>
              <Pressable
                onPress={() => setShowBarangayPicker(!showBarangayPicker)}
                style={styles.picker}
              >
                <Text style={styles.pickerText}>
                  {form.barangay || "Piliin ang barangay"}
                </Text>
              </Pressable>
              {showBarangayPicker && (
                <ScrollView style={styles.pickerDropdown}>
                  {BARANGAYS_MALASIQUI.map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => {
                        update("barangay", b);
                        setShowBarangayPicker(false);
                      }}
                      style={styles.pickerItem}
                    >
                      <Text style={styles.pickerItemText}>{b}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Kapanganakan (YYYY-MM-DD)/(TAON-BUWAN-ARAW)
              </Text>
              <TextInput
                value={form.birthdate}
                onChangeText={(t) => update("birthdate", t)}
                placeholder="Hal. 1990-01-15"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Kasarian
              </Text>
              <View style={styles.sexOptions}>
                {SEX_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    onPress={() => update("sex", o.value as Sex)}
                    style={[
                      styles.sexOption,
                      form.sex === o.value && styles.sexOptionSelected,
                    ]}
                  >
                    <Text
                      style={
                        form.sex === o.value
                          ? styles.sexOptionTextSelected
                          : styles.sexOptionText
                      }
                    >
                      {o.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              onPress={() => update("isSeniorOrPwd", !form.isSeniorOrPwd)}
              style={styles.checkbox}
            >
              <View
                style={[
                  styles.checkboxBox,
                  form.isSeniorOrPwd && styles.checkboxBoxChecked,
                ]}
              >
                {form.isSeniorOrPwd && (
                  <Ionicons name="checkmark" size={18} color="#fff" />
                )}
              </View>
              <Text style={styles.checkboxText}>
                Senior Citizen o PWD (opsyonal)
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setStep(3)} // Using NativeWind classes
              disabled={!canNextStep2}
              style={[styles.button, !canNextStep2 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-base text-teal-600 mb-4">
              Gumawa ng 4–6 na digit/numero (hindi password)
            </Text>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                PIN
              </Text>
              <TextInput
                value={form.pin}
                onChangeText={(t) =>
                  update("pin", t.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="4–6 digit"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Text className="text-base font-semibold text-teal-700 mb-2">
                Ulitin ang PIN
              </Text>
              <TextInput
                value={pinConfirm}
                onChangeText={(t) =>
                  setPinConfirm(t.replace(/\D/g, "").slice(0, 6))
                }
                placeholder="Ulitin ang PIN"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />
            </View>
            <Pressable
              onPress={handleProceedToVerification} // Using NativeWind classes
              disabled={!canNextStep3}
              style={[styles.button, !canNextStep3 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 4 && (
          <>
            <Text className="text-base text-teal-600 mb-4">
              Verification - Kumpletuhin ang rehistrasyon
            </Text>
            <View className="bg-teal-50 rounded-2xl p-6 items-center mb-6">
              <Ionicons // Using NativeWind classes
                name="checkmark-circle"
                size={64}
                color="#0D9488"
              />
              <Text className="text-xl font-bold text-teal-900 mb-2">
                Halos tapos na!
              </Text>
              <Text className="text-base text-teal-600 text-center mb-6">
                Suriin ang iyong mga detalye at tapusin ang iyong rehistrasyon.
              </Text>

              <View className="w-full bg-white rounded-xl p-4">
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-sm text-gray-700 font-semibold">
                    Pangalan:
                  </Text>
                  <Text className="text-sm text-teal-700 font-semibold">
                    {form.firstName}{" "}
                    {form.middleName ? form.middleName + " " : ""}
                    {form.lastName}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-sm text-gray-700 font-semibold">
                    Telepono:
                  </Text>
                  <Text className="text-sm text-teal-700 font-semibold">
                    {form.phone}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-sm text-gray-700 font-semibold">
                    Barangay:
                  </Text>
                  <Text className="text-sm text-teal-700 font-semibold">
                    {form.barangay}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2 border-b border-gray-200">
                  <Text className="text-sm text-gray-700 font-semibold">
                    Kapanganakan:
                  </Text>
                  <Text className="text-sm text-teal-700 font-semibold">
                    {form.birthdate}
                  </Text>
                </View>
                <View className="flex-row justify-between py-2">
                  <Text className="text-sm text-gray-700 font-semibold">
                    Kasarian:
                  </Text>
                  <Text className="text-sm text-teal-700 font-semibold">
                    {SEX_OPTIONS.find((o) => o.value === form.sex)?.label}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={async () => {
                setLoading(true);
                // Mocking API call for testing as per TODO.md
                setTimeout(() => {
                  setLoading(false);
                  Alert.alert("Tagumpay!", "Rehistrasyon matagumpay (Mock).", [
                    {
                      text: "OK",
                      onPress: () => router.replace("/(tabs)"),
                    },
                  ]);
                }, 1000);

                // try {
                //   const result = await authApi.register(form);
                //   ... rest of the code
                // } catch (e: unknown) {
                //   ...
                // }
              }}
              disabled={loading} // Using NativeWind classes
              style={[styles.button, loading && styles.buttonDisabled]}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Tapusin ang Rehistrasyon</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
// Converted StyleSheet to NativeWind classes where possible, keeping some for complex layouts if needed.
const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14, // Slightly reduced padding for better fit
    fontSize: 16, // Kept large font size
    color: "#115E59",
  },
  picker: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 16, // Kept large border radius
    paddingHorizontal: 16,
    paddingVertical: 14, // Slightly reduced padding for better fit
  },
  pickerText: {
    // Kept for specific text styling
    fontSize: 16,
    color: "#115E59",
  },
  pickerItemText: {
    // Kept for specific text styling
    fontSize: 16,
    color: "#115E59",
  },
  pickerDropdown: {
    maxHeight: 160,
    marginTop: 8,
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 12, // Kept large border radius
    backgroundColor: "#FFFFFF",
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#CCFBF1",
  },
  sexOptions: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  sexOption: {
    backgroundColor: "#F0FDFA",
    borderWidth: 1,
    borderColor: "#99F6E4",
    borderRadius: 16, // Kept large border radius
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sexOptionSelected: {
    // Kept for specific selected state styling
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  sexOptionText: {
    color: "#115E59",
  },
  sexOptionTextSelected: {
    color: "#FFFFFF",
    fontWeight: "600", // Kept for specific selected state styling
  },
  checkbox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 24,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2, // Kept for specific checkbox styling
    borderColor: "#5EEAD4",
  },
  checkboxBoxChecked: {
    backgroundColor: "#0D9488",
    borderColor: "#0D9488",
  },
  checkboxText: {
    fontSize: 16, // Kept large font size
    color: "#115E59",
  },
  button: {
    backgroundColor: "#0D9488",
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    // Kept for specific disabled state styling
    backgroundColor: "#94A3B8",
  },
  buttonText: {
    textAlign: "center",
    fontSize: 16, // Kept large font size
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
