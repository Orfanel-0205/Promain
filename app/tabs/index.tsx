import { View, Text } from 'react-native';
import { useAuth } from '@/context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();

  return (
    <View className="flex-1 p-6 bg-gray-100">
      <Text className="text-xl font-bold">Welcome, {user?.name}</Text>
      <Text className="mt-2 text-gray-600">
        Rural Health Unit Dashboard
      </Text>
    </View>
  );
}
