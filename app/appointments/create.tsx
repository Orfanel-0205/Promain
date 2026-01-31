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
import { useAuth } from '@/context/AuthContext';
import { createAppointment } from '@/services/api/appointments';
import { SERVICE_TYPES, TIME_BLOCKS, RHU_OPTIONS } from '@/utils/constants';
import type { ServiceType, TimeBlock, RhuLocation } from '@/types';
import type { Appointment } from '@/types';

const STEPS = 5;

export default function CreateAppointmentScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [serviceType, setServiceType] = useState<ServiceType>('consultation');
  const [preferredDate, setPreferredDate] = useState('');
  const [timeBlock, setTimeBlock] = useState<TimeBlock>('AM');
  const [rhuLocation, setRhuLocation] = useState<RhuLocation>('RHU1');
  const [symptomsOrReason, setSymptomsOrReason] = useState('');
  const [created, setCreated] = useState<Appointment | null>(null);

  const canNext1 = !!serviceType;
  const canNext2 = preferredDate.length >= 10;
  const canNext3 = !!timeBlock;
  const canNext4 = !!rhuLocation;

  const handleConfirm = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const appointment = await createAppointment({
        serviceType,
        preferredDate,
        timeBlock,
        rhuLocation,
        symptomsOrReason: symptomsOrReason.trim() || undefined,
      });
      setCreated(appointment);
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Hindi makapag-book. Subukan muli.';
      Alert.alert('', msg || 'Hindi makapag-book. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <View className="flex-1 bg-white px-6 pt-12 pb-8">
        <Text className="text-heading-lg font-bold text-teal-900 mb-2 text-center">Naka-book na!</Text>
        <View className="bg-primary rounded-2xl p-6 mt-4 mb-4">
          <Text className="text-body text-white/90 text-center mb-2">Iyong queue number</Text>
          <Text className="text-4xl font-bold text-white text-center">Q-{created.queueNumber}</Text>
          <Text className="text-body text-white/90 text-center mt-2">
            {created.rhuLocation} • {created.preferredDate} {created.timeBlock}
          </Text>
        </View>
        {created.qrCodeData && (
          <View className="items-center py-4">
            <Text className="text-body text-teal-800 mb-2">I-scan ang QR sa RHU</Text>
            <View className="w-48 h-48 bg-white border-2 border-teal-300 rounded-xl items-center justify-center">
              <Text className="text-body text-teal-600">QR Code: {created.qrCodeData.slice(0, 20)}...</Text>
            </View>
          </View>
        )}
        <Pressable
          onPress={() => router.replace('/(tabs)')}
          className="bg-primary rounded-2xl py-4 mt-6"
        >
          <Text className="text-center text-body font-bold text-white">Balik sa Home</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <ScrollView
        contentContainerStyle={{ padding: 24, paddingBottom: 48 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-row items-center gap-2 mb-6">
          <Pressable onPress={() => (step > 1 ? setStep(step - 1) : router.back())}>
            <Ionicons name="arrow-back" size={28} color="#0D9488" />
          </Pressable>
          <Text className="text-heading font-bold text-teal-900">
            Mag-book – Hakbang {step}/{STEPS}
          </Text>
        </View>

        {step === 1 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Anong serbisyo ang kailangan mo?</Text>
            {SERVICE_TYPES.map((s) => (
              <Pressable
                key={s.value}
                onPress={() => setServiceType(s.value as ServiceType)}
                className={`rounded-2xl p-4 mb-3 flex-row items-center gap-3 ${serviceType === s.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
              >
                <Text className="text-body">{serviceType === s.value ? '✓' : ''}</Text>
                <Text className={`text-body font-semibold flex-1 ${serviceType === s.value ? 'text-white' : 'text-teal-900'}`}>
                  {s.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setStep(2)}
              disabled={!canNext1}
              className="bg-primary rounded-2xl py-4 mt-4"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 2 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Kailan mo gusto? (YYYY-MM-DD)</Text>
            <TextInput
              value={preferredDate}
              onChangeText={setPreferredDate}
              placeholder="Hal. 2025-02-15"
              placeholderTextColor="#94A3B8"
              className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900 mb-6"
            />
            <Pressable
              onPress={() => setStep(3)}
              disabled={!canNext2}
              className="bg-primary rounded-2xl py-4"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 3 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Umaga o Hapon?</Text>
            {TIME_BLOCKS.map((t) => (
              <Pressable
                key={t.value}
                onPress={() => setTimeBlock(t.value as TimeBlock)}
                className={`rounded-2xl p-4 mb-3 ${timeBlock === t.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
              >
                <Text className={`text-body font-semibold ${timeBlock === t.value ? 'text-white' : 'text-teal-900'}`}>
                  {t.label}
                </Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setStep(4)}
              disabled={!canNext3}
              className="bg-primary rounded-2xl py-4 mt-4"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 4 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Saan? RHU1 o RHU2?</Text>
            {RHU_OPTIONS.map((r) => (
              <Pressable
                key={r.value}
                onPress={() => setRhuLocation(r.value as RhuLocation)}
                className={`rounded-2xl p-4 mb-3 ${rhuLocation === r.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
              >
                <Text className={`text-body font-semibold ${rhuLocation === r.value ? 'text-white' : 'text-teal-900'}`}>
                  {r.label}
                </Text>
              </Pressable>
            ))}
            <Text className="text-body text-teal-800 mb-2 mt-4">Sintomas o dahilan (opsyonal)</Text>
            <TextInput
              value={symptomsOrReason}
              onChangeText={setSymptomsOrReason}
              placeholder="Maaring boses o text"
              placeholderTextColor="#94A3B8"
              multiline
              className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900 min-h-[80px] mb-6"
            />
            <Pressable
              onPress={() => setStep(5)}
              disabled={!canNext4}
              className="bg-primary rounded-2xl py-4"
            >
              <Text className="text-center text-body font-bold text-white">Susunod</Text>
            </Pressable>
          </>
        )}

        {step === 5 && (
          <>
            <Text className="text-body text-teal-800 mb-4">Kumpirmahin ang detalye</Text>
            <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
              <Text className="text-body text-teal-900">
                Serbisyo: {SERVICE_TYPES.find((s) => s.value === serviceType)?.label}
              </Text>
              <Text className="text-body text-teal-900 mt-1">Petsa: {preferredDate}</Text>
              <Text className="text-body text-teal-900 mt-1">Oras: {timeBlock === 'AM' ? 'Umaga' : 'Hapon'}</Text>
              <Text className="text-body text-teal-900 mt-1">Lugar: {rhuLocation}</Text>
              {symptomsOrReason.trim() && (
                <Text className="text-body text-teal-900 mt-1">Dahilan: {symptomsOrReason}</Text>
              )}
            </View>
            <Pressable
              onPress={handleConfirm}
              disabled={loading}
              className="bg-primary rounded-2xl py-4"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center text-body font-bold text-white">Kumpirmahin at i-book</Text>
              )}
            </Pressable>
          </>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
