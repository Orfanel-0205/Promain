import { View, Text } from 'react-native';
import Header from '@/components/layout/Header';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';

export default function Profile() {
  const { logout } = useAuth();

  return (
    <View className="flex-1 bg-background">
      <Header title="Profile" />

      <View className="p-6">
        <Text className="text-lg font-semibold">
          Nurse Maria
        </Text>
        <Text className="text-muted mb-6">
          Rural Health Unit Staff
        </Text>

        <Button title="Logout" onPress={logout} />
      </View>
    </View>
  );
}
