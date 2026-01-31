import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAnnouncements } from '@/services/api/announcements';
import { useTts } from '@/hooks/useTts';
import type { Announcement } from '@/types';

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: '1',
    title: 'RHU Schedule',
    titleFil: 'Oras ng RHU',
    body: 'RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.',
    bodyFil: 'RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.',
    type: 'announcement',
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Health Tip',
    titleFil: 'Tip sa kalusugan',
    body: 'Uminom ng 8 basong tubig araw-araw. Kumain ng gulay at prutas.',
    bodyFil: 'Uminom ng 8 basong tubig araw-araw. Kumain ng gulay at prutas.',
    type: 'health_tip',
    createdAt: new Date().toISOString(),
  },
];

export default function AnnouncementsScreen() {
  const router = useRouter();
  const { speak } = useTts();
  const [items, setItems] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAnnouncements()
      .then(setItems)
      .catch(() => setItems(DEFAULT_ANNOUNCEMENTS))
      .finally(() => setLoading(false));
  }, []);

  const list = items.length ? items : DEFAULT_ANNOUNCEMENTS;

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#0D9488" />
        </Pressable>
        <Text className="text-heading font-bold text-teal-900">Mga anunsyo at health tips</Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#0D9488" />
        </View>
      ) : (
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        >
          {list.map((a) => (
            <View
              key={a.id}
              className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200"
            >
              <Text className="text-heading font-bold text-teal-900 mb-2">
                {a.titleFil || a.title}
              </Text>
              <Text className="text-body text-teal-800 mb-3">{a.bodyFil || a.body}</Text>
              <Pressable
                onPress={() => speak(`${a.titleFil || a.title}. ${a.bodyFil || a.body}`)}
                className="rounded-xl bg-primary px-3 py-2 flex-row items-center gap-2 self-start"
              >
                <Ionicons name="volume-high" size={20} color="#fff" />
                <Text className="text-body font-semibold text-white">Makinig (Read Aloud)</Text>
              </Pressable>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
