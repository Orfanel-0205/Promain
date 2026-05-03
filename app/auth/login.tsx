import { useState } from 'react';
import { View, Text, TextInput, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import type { LoginInput } from '@/types';

export default function LoginScreen() {
  const router = useRouter();
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!phone.match(/^09\d{9}$/)) {
      Alert.alert('Mali', 'Ilagay ang tamang numero ng telepono (09XXXXXXXXX).');
      return;
    }

    if (pin.length < 4) {
      Alert.alert('Mali', 'Ilagay ang iyong PIN (4–6 digit).');
      return;
    }

    setLoading(true);
    try {
      await login({ phone, pin });
      router.replace('/(tabs)');
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        'Hindi makapag-login. Subukan muli.';
      Alert.alert('Error sa Pag-login', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-white px-6 pt-12">
      <Pressable onPress={() => router.back()} className="self-start mb-6">
        <Text style={{ fontSize: 18, color: '#0D9488' }}>←</Text>
      </Pressable>

      <Text className="text-3xl font-bold text-teal-900 mb-4">Mag-login</Text>
      <Text className="text-body text-teal-700 mb-8">
        I-login ang iyong account gamit ang iyong numero at PIN.
      </Text>

      <View className="mb-5">
        <Text className="text-sm font-semibold text-teal-900 mb-2">Numero ng Telepono</Text>
        <TextInput
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/\D/g, '').slice(0, 11))}
          placeholder="09XXXXXXXXX"
          placeholderTextColor="#94A3B8"
          keyboardType="phone-pad"
          className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
        />
      </View>

      <View className="mb-8">
        <Text className="text-sm font-semibold text-teal-900 mb-2">PIN</Text>
        <TextInput
          value={pin}
          onChangeText={(text) => setPin(text.replace(/\D/g, '').slice(0, 6))}
          placeholder="4–6 digit"
          placeholderTextColor="#94A3B8"
          secureTextEntry
          keyboardType="number-pad"
          className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
        />
      </View>

      <Pressable
        onPress={handleLogin}
        disabled={loading || phone.length !== 11 || pin.length < 4}
        className="bg-teal-700 rounded-2xl py-4 items-center shadow-md"
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text className="text-white text-body font-bold">Mag-login</Text>
        )}
      </Pressable>

      <View className="mt-6 flex-row justify-center gap-1">
        <Text className="text-sm text-teal-700">Wala pang account?</Text>
        <Pressable onPress={() => router.push('/auth/register')}>
          <Text className="text-sm font-bold text-teal-900">Magrehistro</Text>
        </Pressable>
      </View>
    </View>
  );
}
