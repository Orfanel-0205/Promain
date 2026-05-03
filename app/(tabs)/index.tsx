import { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '@/context/AuthContext';
import { getAppointmentsByUser } from '@/services/api/appointments';
import { getQueueStatus } from '@/services/api/queue';
import type { Appointment } from '@/types';
import type { QueueStatus } from '@/types/queue.types';

/* ─── Placeholder News Data ─── */
const NEWS = [
  {
    id: '1',
    title: 'Libreng Medical Mission',
    summary: 'May libreng konsultasyon at BP check sa Feb 15.',
    type: 'event',
    date: 'Feb 15, 2026',
  },
  {
    id: '2',
    title: 'Telemedicine Now Available',
    summary: 'Pwede ka nang magpakonsulta online.',
    type: 'news',
    date: 'Feb 2, 2026',
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();

  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const firstName = user?.firstName || 'User';

  /* ─── Load Dashboard Data ─── */
  const loadData = useCallback(async () => {
    if (!user?.id) return;
    try {
      const appointments = await getAppointmentsByUser(user.id);
      const upcoming =
        appointments
          .filter((a) => a.status === 'scheduled' || a.status === 'in_queue')
          .sort(
            (a, b) =>
              new Date(a.preferredDate).getTime() -
              new Date(b.preferredDate).getTime()
          )[0] || null;

      setNextAppointment(upcoming);

      if (upcoming?.id) {
        const q = await getQueueStatus(upcoming.id);
        setQueueStatus(q);
      }
    } catch {
      setNextAppointment(null);
      setQueueStatus(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  /* ─── News Card ─── */
  const renderNews = ({ item }: any) => (
    <View className="bg-white rounded-2xl p-4 mb-3 border border-teal-100">
      <Text className="font-bold text-teal-900 mb-1">{item.title}</Text>
      <Text className="text-teal-700 text-sm mb-1">{item.summary}</Text>
      <Text className="text-xs text-slate-400">{item.date}</Text>
    </View>
  );

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      {/* Greeting */}
      <Text className="text-2xl font-bold text-teal-900 mb-1">
        Magandang araw, {firstName}!
      </Text>
      <Text className="text-teal-700 mb-6">
        Piliin ang serbisyong kailangan mo
      </Text>

      {/* Quick Actions */}
      <View className="gap-4 mb-6">
        <Action
          icon="calendar"
          label="Mag-book ng Appointment"
          onPress={() => router.push('/appointments/create')}
        />
        <Action
          icon="medkit"
          label="Health Programs"
          onPress={() => router.push('/(tabs)/programs')}
        />
        <Action
          icon="ticket"
          label="My Queue"
          onPress={() => router.push('/(tabs)/queue')}
        />
        <Action
          icon="chatbubble-ellipses"
          label="Ask Ka-agapay"
          onPress={() => router.push('/chatbot')}
        />
      </View>

      {/* Appointment & Queue */}
      {loading ? (
        <ActivityIndicator color="#0D9488" />
      ) : (
        <>
          {nextAppointment && (
            <View className="bg-teal-50 rounded-2xl p-4 mb-4">
              <Text className="font-semibold text-teal-900">
                📅 Susunod na Appointment
              </Text>
              <Text className="text-teal-700">
                {nextAppointment.preferredDate} • Q-
                {nextAppointment.queueNumber}
              </Text>
            </View>
          )}

          {queueStatus && (
            <View className="bg-primary/10 rounded-2xl p-4 mb-6">
              <Text className="font-bold text-teal-900">
                Now Serving: {queueStatus.nowServing}
              </Text>
              <Text className="text-teal-700">
                Est. wait: {queueStatus.estimatedWaitMinutes} mins
              </Text>
            </View>
          )}
        </>
      )}

      {/* News */}
      <Text className="text-xl font-bold text-teal-900 mb-3">
        📰 Balita at Events
      </Text>

      <FlatList
        data={NEWS}
        renderItem={renderNews}
        keyExtractor={(item) => item.id}
        scrollEnabled={false}
      />
    </ScrollView>
  );
}

/* ─── Reusable Action Button ─── */
function Action({ icon, label, onPress }: any) {
  return (
    <Pressable
      onPress={onPress}
      className="bg-teal-100 rounded-2xl p-5 flex-row items-center gap-4 border border-teal-200"
    >
      <Ionicons name={icon} size={26} color="#0D9488" />
      <Text className="font-bold text-teal-900 flex-1">{label}</Text>
      <Ionicons name="chevron-forward" size={22} color="#0D9488" />
    </Pressable>
  );
}
