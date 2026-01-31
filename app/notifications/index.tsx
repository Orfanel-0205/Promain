import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const MOCK_NOTIFICATIONS = [
  { id: '1', title: 'Alaala sa appointment', body: 'May appointment ka bukas, 8:00 AM, RHU1.', time: 'Kanina', read: false },
  { id: '2', title: 'Ikaw na ang susunod', body: 'Pumunta na sa window ng RHU. Queue Q-012.', time: 'Kahapon', read: true },
  { id: '3', title: 'Health program', body: 'Bakuna para sa mga bata – Martes at Huwebes.', time: '2 araw na ang nakalipas', read: true },
];

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#0D9488" />
        </Pressable>
        <Text className="text-heading font-bold text-teal-900">Mga abiso</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        {MOCK_NOTIFICATIONS.map((n) => (
          <View
            key={n.id}
            className={`rounded-2xl p-4 mb-3 border ${n.read ? 'bg-teal-50 border-teal-200' : 'bg-primary/5 border-primary/30'}`}
          >
            <Text className="text-heading font-semibold text-teal-900">{n.title}</Text>
            <Text className="text-body text-teal-800 mt-1">{n.body}</Text>
            <Text className="text-body text-teal-600 mt-2">{n.time}</Text>
          </View>
        ))}
        <Text className="text-body text-teal-600 text-center mt-4">
          SMS fallback kapag mahina ang internet.
        </Text>
      </ScrollView>
    </View>
  );
}
