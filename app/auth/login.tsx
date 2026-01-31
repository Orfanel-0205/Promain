import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
  Keyboard,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

// Same logo as loading/splash – appears at top of login (transition from loading)
const LOGO_SOURCE = require('@/assets/images/splash-icon.png');

export default function LoginScreen() {
  const router = useRouter();
  const { login, biometricAvailable, authenticateWithBiometric, loginWithToken } = useAuth();
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPin, setShowPin] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();
    const trimmedPhone = phone.replace(/\D/g, '');
    if (!trimmedPhone || trimmedPhone.length < 10) {
      Alert.alert('', 'Pakilagay ang tamang numero ng telepono.');
      return;
    }
    if (!pin || pin.length < 4 || pin.length > 6) {
      Alert.alert('', 'Ang PIN ay dapat 4 hanggang 6 na digit.');
      return;
    }
    setLoading(true);
    try {
      await login({ phone: trimmedPhone, pin });
    } catch (e: unknown) {
      const msg = e && typeof e === 'object' && 'response' in e
        ? (e as { response?: { data?: { message?: string } } }).response?.data?.message
        : 'Hindi makapag-login. Subukan muli.';
      Alert.alert('', msg || 'Hindi makapag-login. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  const handleBiometric = async () => {
    if (!biometricAvailable) return;
    const ok = await authenticateWithBiometric();
    if (!ok) return;
    const token = await SecureStore.getItemAsync('token');
    const storedUser = await SecureStore.getItemAsync('user');
    if (token && storedUser) {
      await loginWithToken(token, JSON.parse(storedUser));
    } else {
      Alert.alert('', 'Mag-log in muna gamit ang PIN para magamit ang fingerprint.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
      className="bg-white"
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 40,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo at top – same as loading screen (transition from splash) */}
        <View className="items-center pt-4 pb-4">
          <Image
            source={LOGO_SOURCE}
            resizeMode="contain"
            style={{ width: 120, height: 120 }}
          />
        </View>

        <Text className="text-heading-lg font-bold text-teal-900 text-center mb-1">
          Ka-agapay
        </Text>
        <Text className="text-body text-teal-800 text-center mb-6">
          Malasiqui RHU – Health at Your Side
        </Text>

        <View className="mb-4">
          <Text className="text-body font-semibold text-teal-900 mb-2">
            📱 Numero ng telepono
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="09XXXXXXXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={11}
            className="bg-teal-50 border border-teal-200 rounded-2xl px-4 py-4 text-body text-teal-900"
          />
        </View>

        <View className="mb-6">
          <Text className="text-body font-semibold text-teal-900 mb-2">
            🔐 PIN (4–6 digit)
          </Text>
          <View className="flex-row items-center bg-teal-50 border border-teal-200 rounded-2xl">
            <TextInput
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPin}
              keyboardType="number-pad"
              maxLength={6}
              className="flex-1 px-4 py-4 text-body text-teal-900"
            />
            <Pressable onPress={() => setShowPin(!showPin)} className="pr-4">
              <Ionicons name={showPin ? 'eye-off' : 'eye'} size={24} color="#0D9488" />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          className="bg-primary rounded-2xl py-4 shadow-md active:opacity-90"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-body font-bold text-white">
              Mag-log in
            </Text>
          )}
        </Pressable>

        {biometricAvailable && (
          <Pressable
            onPress={handleBiometric}
            className="mt-4 rounded-2xl py-3 border-2 border-primary items-center"
          >
            <Ionicons name="finger-print" size={28} color="#0D9488" />
            <Text className="text-body font-semibold text-primary mt-1">
              Mag-log in gamit ang fingerprint
            </Text>
          </Pressable>
        )}

        <Pressable
          onPress={() => router.push('/auth/register')}
          className="mt-8 rounded-2xl py-4 border-2 border-teal-300"
        >
          <Text className="text-center text-body font-semibold text-teal-800">
            Walang account? Magrehistro
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
