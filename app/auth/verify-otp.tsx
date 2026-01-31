import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as authApi from '@/services/api/auth';
import { useAuth } from '@/context/AuthContext';

export default function VerifyOtpScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ phone?: string }>();
  const phone = params.phone || '';
  const { loginWithToken } = useAuth();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp || otp.length < 4) {
      Alert.alert('', 'Pakilagay ang OTP na naipadala sa iyong numero.');
      return;
    }
    setLoading(true);
    try {
      const { token, user } = await authApi.verifyOtp({ phone, otp });
      await loginWithToken(token, user);
      router.replace('/(tabs)');
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Hindi wasto ang OTP. Subukan muli.';
      Alert.alert('', msg || 'Hindi wasto ang OTP. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Pressable onPress={() => router.back()} className="self-start mb-6">
        <Ionicons name="arrow-back" size={28} color="#0D9488" />
      </Pressable>
      <Text className="text-heading-lg font-bold text-teal-900 mb-2">Ilagay ang OTP</Text>
      <Text className="text-body text-teal-800 mb-6">
        Naipadala sa {phone}. Ilagay ang code dito.
      </Text>
      <TextInput
        value={otp}
        onChangeText={(t) => setOtp(t.replace(/\D/g, '').slice(0, 6))}
        placeholder="000000"
        placeholderTextColor="#94A3B8"
        keyboardType="number-pad"
        maxLength={6}
        className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900 text-center text-2xl tracking-widest mb-6"
      />
      <Pressable
        onPress={handleVerify}
        disabled={loading || otp.length < 4}
        className="bg-primary rounded-2xl py-4 shadow-md"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-center text-body font-bold text-white">Kumpirmahin</Text>
        )}
      </Pressable>
    </View>
  );
}
