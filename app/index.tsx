import { useEffect } from 'react';
import { View, Image, ActivityIndicator, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';

// Same logo as splash screen – transitions visually to login (logo at top)
const SPLASH_LOGO = require('@/assets/images/splash-icon.png');

export default function IndexScreen() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (isLoading) return;
    if (isAuthenticated) {
      router.replace('/(tabs)');
    } else {
      router.replace('/auth/login');
    }
  }, [isAuthenticated, isLoading, router]);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Image
        source={SPLASH_LOGO}
        resizeMode="contain"
        style={{ width: 200, height: 200 }}
        className="mb-6"
      />
      <ActivityIndicator size="large" color="#0D9488" />
      <Text className="mt-4 text-body text-teal-800">Naglo-load...</Text>
    </View>
  );
}
