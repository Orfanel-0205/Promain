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

  const handleRequestOtpAndRegister = async () => {
    if (!canNextStep3) {
      Alert.alert('', 'Tiyaking 4–6 digit ang PIN at magkapareho ang PIN at kumpirmasyon.');
      return;
    }
    setLoading(true);
    try {
      await authApi.requestOtp(form.phone.replace(/\D/g, ''));
      await authApi.register(form);
      router.replace({ pathname: '/auth/verify-otp', params: { phone: form.phone.replace(/\D/g, '') } });
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Hindi makapagrehistro. Subukan muli.';
      Alert.alert('', msg || 'Hindi makapagrehistro. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center gap-2 mb-6">
          <Pressable onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
            <Ionicons name="arrow-back" size={28} color="#0D9488" />
          </Pressable>
          <Text className="text-heading font-bold text-teal-900">Magrehistro – Hakbang {step}/{STEPS}</Text>
        </View>

        {step === 1 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Pangalan at numero ng telepono</Text>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">👤 Unang pangalan</Text>
              <TextInput
                value={form.firstName}
                onChangeText={(t) => update('firstName', t)}
                placeholder="Unang pangalan"
                placeholderTextColor="#94A3B8"
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">👤 Apelyido</Text>
              <TextInput
                value={form.lastName}
                onChangeText={(t) => update('lastName', t)}
                placeholder="Apelyido"
                placeholderTextColor="#94A3B8"
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <View className="mb-6">
              <Text className="text-body font-semibold text-teal-900 mb-2">📱 Numero ng telepono</Text>
              <TextInput
                value={form.phone}
                onChangeText={(t) => setForm((f) => ({ ...f, phone: t }))}
                placeholder="09XXXXXXXXX"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                maxLength={11}
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <Pressable
              onPress={() => setStep(2)}
              disabled={!canNextStep1}
              className="bg-primary rounded-2xl py-4 shadow-md"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Barangay, kapanganakan, at kasarian</Text>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">📍 Barangay</Text>
              <Pressable
                onPress={() => setShowBarangayPicker(!showBarangayPicker)}
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4"
              >
                <Text className="text-body text-teal-900">{form.barangay || 'Piliin ang barangay'}</Text>
              </Pressable>
              {showBarangayPicker && (
                <ScrollView className="max-h-40 mt-2 border border-teal-200 rounded-xl bg-white">
                  {BARANGAYS_MALASIQUI.map((b) => (
                    <Pressable
                      key={b}
                      onPress={() => { update('barangay', b); setShowBarangayPicker(false); }}
                      className="px-4 py-3 border-b border-teal-100"
                    >
                      <Text className="text-body text-teal-900">{b}</Text>
                    </Pressable>
                  ))}
                </ScrollView>
              )}
            </View>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">📅 Kapanganakan (YYYY-MM-DD)</Text>
              <TextInput
                value={form.birthdate}
                onChangeText={(t) => update('birthdate', t)}
                placeholder="Hal. 1990-01-15"
                placeholderTextColor="#94A3B8"
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">⚥ Kasarian</Text>
              <View className="flex-row gap-2 flex-wrap">
                {SEX_OPTIONS.map((o) => (
                  <Pressable
                    key={o.value}
                    onPress={() => update('sex', o.value as Sex)}
                    className={`rounded-2xl px-4 py-3 ${form.sex === o.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
                  >
                    <Text className={form.sex === o.value ? 'text-white font-semibold' : 'text-teal-900'}>
                      {o.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>
            <Pressable
              onPress={() => update('isSeniorOrPwd', !form.isSeniorOrPwd)}
              className="flex-row items-center gap-2 mb-6"
            >
              <View className={`w-6 h-6 rounded border-2 ${form.isSeniorOrPwd ? 'bg-primary border-primary' : 'border-teal-400'}`}>
                {form.isSeniorOrPwd && <Ionicons name="checkmark" size={18} color="#fff" />}
              </View>
              <Text className="text-body text-teal-900">Senior Citizen o PWD (opsyonal)</Text>
            </Pressable>
            <Pressable
              onPress={() => setStep(3)}
              disabled={!canNextStep2}
              className="bg-primary rounded-2xl py-4 shadow-md"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Gumawa ng 4–6 digit PIN (hindi password)</Text>
            <View className="mb-4">
              <Text className="text-body font-semibold text-teal-900 mb-2">🔐 PIN</Text>
              <TextInput
                value={form.pin}
                onChangeText={(t) => update('pin', t.replace(/\D/g, '').slice(0, 6))}
                placeholder="4–6 digit"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <View className="mb-6">
              <Text className="text-body font-semibold text-teal-900 mb-2">🔐 Ulitin ang PIN</Text>
              <TextInput
                value={pinConfirm}
                onChangeText={(t) => setPinConfirm(t.replace(/\D/g, '').slice(0, 6))}
                placeholder="Ulitin ang PIN"
                placeholderTextColor="#94A3B8"
                secureTextEntry
                keyboardType="number-pad"
                maxLength={6}
                className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
              />
            </View>
            <Pressable
              onPress={handleRequestOtpAndRegister}
              disabled={loading || !canNextStep3}
              className="bg-primary rounded-2xl py-4 shadow-md"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-body font-bold text-white">Magpadala ng OTP at Magrehistro</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
