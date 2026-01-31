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
  StyleSheet,
} from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

// Logo for login page
const LOGO_SOURCE = require('@/assets/images/logo.png');

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
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoContainer}>
          <Image
            source={LOGO_SOURCE}
            resizeMode="contain"
            style={styles.logo}
          />
        </View>

        <Text style={styles.title}>
          Ka-agapay
        </Text>
        <Text style={styles.subtitle}>
          Malasiqui RHU – Sandalan Para Sa Kalusugan
        </Text>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            Numero ng Telepono
          </Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            placeholder="09XXXXXXXXX"
            placeholderTextColor="#94A3B8"
            keyboardType="phone-pad"
            maxLength={11}
            style={styles.input}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>
            PIN (4–6 digit)
          </Text>
          <View style={styles.pinContainer}>
            <TextInput
              value={pin}
              onChangeText={(t) => setPin(t.replace(/\D/g, '').slice(0, 6))}
              placeholder="••••"
              placeholderTextColor="#94A3B8"
              secureTextEntry={!showPin}
              keyboardType="number-pad"
              maxLength={6}
              style={styles.pinInput}
            />
            <Pressable onPress={() => setShowPin(!showPin)} style={styles.eyeButton}>
              <Ionicons name={showPin ? 'eye-off' : 'eye'} size={24} color="#0F766E" />
            </Pressable>
          </View>
        </View>

        <Pressable
          onPress={handleLogin}
          disabled={loading}
          style={styles.loginButton}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.loginButtonText}>
              Mag-log in
            </Text>
          )}
        </Pressable>

        <Pressable
          onPress={() => router.push('/auth/register')}
          style={styles.registerButton}
        >
          <Text style={styles.registerButtonText}>
            Magrehistro
          </Text>
        </Pressable>

        {biometricAvailable && (
          <Pressable
            onPress={handleBiometric}
            style={styles.biometricButton}
          >
            <Ionicons name="finger-print" size={28} color="white" />
            <Text style={styles.biometricButtonText}>
              Biometric scanner
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2ED3B7',
  },
  scrollContainer: {
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 40,
    paddingBottom: 60,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: 16,
    paddingBottom: 16,
  },
  logo: {
    width: 120,
    height: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 24,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  pinContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#0F766E',
    borderRadius: 16,
  },
  pinInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    paddingRight: 16,
  },
  loginButton: {
    backgroundColor: '#6B7280',
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
  loginButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  biometricButton: {
    marginTop: 16,
    borderRadius: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  biometricButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginTop: 4,
  },
  registerButton: {
    backgroundColor: '#0F766E',
    marginTop: 32,
    borderRadius: 16,
    paddingVertical: 16,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  registerButtonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});