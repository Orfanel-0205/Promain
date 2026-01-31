import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as authApi from '@/services/api/auth';
import { BARANGAYS_MALASIQUI, SEX_OPTIONS } from '@/utils/constants';
import type { RegisterInput, Sex } from '@/types';

const STEPS = 4;

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<RegisterInput>({
    firstName: '',
    lastName: '',
    phone: '',
    barangay: '',
    birthdate: '',
    sex: 'male',
    isSeniorOrPwd: false,
    pin: '',
  });
  const [pinConfirm, setPinConfirm] = useState('');
  const [showBarangayPicker, setShowBarangayPicker] = useState(false);

  const update = (k: keyof RegisterInput, v: string | boolean) => {
    setForm((f) => ({ ...f, [k]: v }));
  };

  const canNextStep1 = form.firstName.trim() && form.lastName.trim() && form.phone.replace(/\D/g, '').length >= 10;
  const canNextStep2 = form.barangay && form.birthdate && form.sex;
  const canNextStep3 = form.pin.length >= 4 && form.pin.length <= 6 && form.pin === pinConfirm;

  const handleProceedToVerification = () => {
    if (!canNextStep3) {
      Alert.alert('', 'Tiyaking 4–6 digit ang PIN at magkapareho ang PIN at kumpirmasyon.');
      return;
    }
    setStep(4);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Pressable onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
            <Ionicons name="arrow-back" size={28} color="#0D9488" />
          </Pressable>
          <Text style={styles.headerText}>Magrehistro – Hakbang {step}/{STEPS}</Text>
        </View>

        {step === 1 && (
          <>
            <Text style={styles.sectionTitle}>Pangalan at numero ng telepono</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>👤 Unang pangalan</Text>
              <TextInput
                value={form.firstName}
                onChangeText={(t) => update('firstName', t)}
                placeholder="Unang pangalan"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>👤 Apelyido</Text>
              <TextInput
                value={form.lastName}
                onChangeText={(t) => update('lastName', t)}
                placeholder="Apelyido"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📱 Numero ng telepono</Text>
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
              onPress={() => setStep(2)}
              disabled={!canNextStep1}
              style={[styles.button, !canNextStep1 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text style={styles.sectionTitle}>Barangay, kapanganakan, at kasarian</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📍 Barangay</Text>
              <Pressable
                onPress={() => setShowBarangayPicker(!showBarangayPicker)}
                style={styles.picker}
              >
                <Text style={styles.pickerText}>{form.barangay || 'Piliin ang barangay'}</Text>
              </Pressable>
              {showBarangayPicker && (
                <ScrollView style={styles.pickerDropdown}>
                  {BARANGAYS_MALASIQUI.map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => { update('barangay', b); setShowBarangayPicker(false); }}
                      style={styles.pickerItem}
                    >
                      <Text style={styles.pickerItemText}>{b}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>📅 Kapanganakan (YYYY-MM-DD)</Text>
              <TextInput
                value={form.birthdate}
                onChangeText={(t) => update('birthdate', t)}
                placeholder="Hal. 1990-01-15"
                placeholderTextColor="#94A3B8"
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>⚥ Kasarian</Text>
              <View style={styles.sexOptions}>
                {SEX_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    onPress={() => update('sex', o.value as Sex)}
                    style={[
                      styles.sexOption,
                      form.sex === o.value && styles.sexOptionSelected
                    ]}
                  >
                    <Text style={form.sex === o.value ? styles.sexOptionTextSelected : styles.sexOptionText}>
                      {o.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              onPress={() => update('isSeniorOrPwd', !form.isSeniorOrPwd)}
              style={styles.checkbox}
            >
              <View style={[
                styles.checkboxBox,
                form.isSeniorOrPwd && styles.checkboxBoxChecked
              ]}>
                {form.isSeniorOrPwd && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
              <Text style={styles.checkboxText}>Senior Citizen o PWD (opsyonal)</Text>
            </Pressable>
            <Pressable
              onPress={() => setStep(3)}
              disabled={!canNextStep2}
              style={[styles.button, !canNextStep2 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text style={styles.sectionTitle}>Gumawa ng 4–6 digit PIN (hindi password)</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔐 PIN</Text>
              <TextInput
                value={form.pin}
                onChangeText={(t) => update('pin', t.replace(/\D/g, '').slice(0, 6))}
                placeholder="4–6 digit"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />
            </View>
            <View style={styles.inputContainer}>
              <Text style={styles.inputLabel}>🔐 Ulitin ang PIN</Text>
              <TextInput
                value={pinConfirm}
                onChangeText={(t) => setPinConfirm(t.replace(/\D/g, '').slice(0, 6))}
                placeholder="Ulitin ang PIN"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                style={styles.input}
              />
            </View>
            <Pressable
              onPress={handleProceedToVerification}
              disabled={!canNextStep3}
              style={[styles.button, !canNextStep3 && styles.buttonDisabled]}
            >
              <Text style={styles.buttonText}>Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 4 && (
          <>
            <Text style={styles.sectionTitle}>Verification - Kumpletuhin ang rehistrasyon</Text>
            <View style={styles.verificationBox}>
              <Ionicons name="checkmark-circle" size={64} color="#0D9488" style={styles.verificationIcon} />
              <Text style={styles.verificationTitle}>Halos tapos na!</Text>
              <Text style={styles.verificationText}>
                Suriin ang iyong mga detalye at tapusin ang iyong rehistrasyon.
              </Text>
              
              <View style={styles.summaryContainer}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Pangalan:</Text>
                  <Text style={styles.summaryValue}>{form.firstName} {form.lastName}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Telepono:</Text>
                  <Text style={styles.summaryValue}>{form.phone}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Barangay:</Text>
                  <Text style={styles.summaryValue}>{form.barangay}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kapanganakan:</Text>
                  <Text style={styles.summaryValue}>{form.birthdate}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>Kasarian:</Text>
                  <Text style={styles.summaryValue}>
                    {SEX_OPTIONS.find(o => o.value === form.sex)?.label}
                  </Text>
                </View>
              </View>
            </View>

            <Pressable
              onPress={async () => {
                console.log('Button clicked - Starting registration...');
                console.log('Form data:', form);
                setLoading(true);
                try {
                  console.log('Calling register API...');
                  const result = await authApi.register(form);
                  console.log('Registration successful:', result);
                  router.replace('/auth/login');
                } catch (e: unknown) {
                  console.error('Registration error:', e);
                  const msg = e && typeof e === 'object' && 'response' in e
                    ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
                    : 'Hindi makapagrehistro. Subukan muli.';
                  Alert.alert('Error', msg || 'Hindi makapagrehistro. Subukan muli.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#115E59',
  },
  sectionTitle: {
    fontSize: 16,
    color: '#14B8A6',
    marginBottom: 16,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#115E59',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#115E59',
  },
  picker: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  pickerText: {
    fontSize: 16,
    color: '#115E59',
  },
  pickerDropdown: {
    maxHeight: 160,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 12,
    backgroundColor: '#FFFFFF',
  },
  pickerItem: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#CCFBF1',
  },
  pickerItemText: {
    fontSize: 16,
    color: '#115E59',
  },
  sexOptions: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  sexOption: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  sexOptionSelected: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  sexOptionText: {
    color: '#115E59',
  },
  sexOptionTextSelected: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 24,
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#5EEAD4',
  },
  checkboxBoxChecked: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  checkboxText: {
    fontSize: 16,
    color: '#115E59',
  },
  button: {
    backgroundColor: '#0D9488',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonDisabled: {
    backgroundColor: '#94A3B8',
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  verificationBox: {
    backgroundColor: '#F0FDFA',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    marginBottom: 24,
  },
  verificationIcon: {
    marginBottom: 16,
  },
  verificationTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#115E59',
    marginBottom: 8,
  },
  verificationText: {
    fontSize: 16,
    color: '#14B8A6',
    textAlign: 'center',
    marginBottom: 24,
  },
  summaryContainer: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  summaryLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  summaryValue: {
    fontSize: 14,
    color: '#115E59',
    fontWeight: '600',
  },
});