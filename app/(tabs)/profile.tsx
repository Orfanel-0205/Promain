import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    Alert.alert('', 'Gusto mo bang mag-log out?', [
      { text: 'Hindi', style: 'cancel' },
      { text: 'Oo', onPress: () => logout().then(() => router.replace('/auth/login')) },
    ]);
  };

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-heading-lg font-bold text-teal-900 mt-2 mb-6">Profile</Text>

      <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
        <View className="flex-row items-center gap-3 mb-3">
          <View className="w-14 h-14 rounded-full bg-primary items-center justify-center">
            <Text className="text-heading font-bold text-white">
              {(user?.firstName?.[0] || user?.fullName?.[0] || '?').toUpperCase()}
            </Text>
          </View>
          <View>
            <Text className="text-heading font-bold text-teal-900">{user?.fullName || 'User'}</Text>
            <Text className="text-body text-teal-700">{user?.phone}</Text>
          </View>
        </View>
        <Text className="text-body text-teal-800">📍 {user?.barangay}</Text>
        <Text className="text-body text-teal-800">📅 Kapanganakan: {user?.birthdate}</Text>
        {user?.isSeniorOrPwd && (
          <Text className="text-body text-teal-800 mt-1">✓ Senior/PWD</Text>
        )}
      </View>

      <Pressable
        onPress={() => router.push('/notifications')}
        className="flex-row items-center gap-4 bg-teal-50 rounded-2xl p-4 mb-3 border border-teal-200"
      >
        <Ionicons name="notifications" size={24} color="#0D9488" />
        <Text className="text-body font-semibold text-teal-900 flex-1">Mga abiso</Text>
        <Ionicons name="chevron-forward" size={22} color="#64748B" />
      </Pressable>

      <Pressable
        onPress={handleLogout}
        className="flex-row items-center gap-4 rounded-2xl p-4 border-2 border-red-200 bg-red-50 mt-4"
      >
        <Ionicons name="log-out" size={24} color="#DC2626" />
        <Text className="text-body font-semibold text-red-700">Mag-log out</Text>
      </Pressable>
    </ScrollView>
  );
}
