import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { getAppointmentsByUser } from '@/services/api/appointments';
import { getQueueStatus } from '@/services/api/queue';
import type { Appointment } from '@/types';
import type { QueueStatus } from '@/types/queue.types';

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const appointments = await getAppointmentsByUser(user.id);
        const upcoming = appointments
          .filter((a) => a.status === 'scheduled' || a.status === 'in_queue')
          .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0] || null;
        setNextAppointment(upcoming);
        if (upcoming?.id) {
          try {
            const q = await getQueueStatus(upcoming.id);
            setQueueStatus(q);
          } catch {
            setQueueStatus(null);
          }
        } else {
          setQueueStatus(null);
        }
      } catch {
        setNextAppointment(null);
        setQueueStatus(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const firstName = user?.firstName || user?.fullName?.split(' ')[0] || 'User';

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-heading-lg font-bold text-teal-900 mt-2 mb-1">
        Magandang araw, {firstName}!
      </Text>
      <Text className="text-body text-teal-800 mb-6">Piliin ang serbisyo na kailangan mo.</Text>

      <View className="gap-4 mb-6">
        <Pressable
          onPress={() => router.push('/appointments/create')}
          className="bg-primary rounded-2xl p-5 flex-row items-center gap-4 shadow-md active:opacity-90"
        >
          <View className="w-12 h-12 rounded-xl bg-white/30 items-center justify-center">
            <Ionicons name="calendar" size={28} color="#fff" />
          </View>
          <Text className="text-heading font-bold text-white flex-1">Mag-book ng Appointment</Text>
          <Ionicons name="chevron-forward" size={24} color="#fff" />
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/programs')}
          className="bg-teal-100 rounded-2xl p-5 flex-row items-center gap-4 border border-teal-200 active:opacity-90"
        >
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Ionicons name="medkit" size={28} color="#0D9488" />
          </View>
          <Text className="text-heading font-bold text-teal-900 flex-1">Health Programs</Text>
          <Ionicons name="chevron-forward" size={24} color="#0D9488" />
        </Pressable>

        <Pressable
          onPress={() => router.push('/(tabs)/queue')}
          className="bg-teal-100 rounded-2xl p-5 flex-row items-center gap-4 border border-teal-200 active:opacity-90"
        >
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Ionicons name="ticket" size={28} color="#0D9488" />
          </View>
          <Text className="text-heading font-bold text-teal-900 flex-1">My Queue</Text>
          <Ionicons name="chevron-forward" size={24} color="#0D9488" />
        </Pressable>

        <Pressable
          onPress={() => router.push('/chatbot')}
          className="bg-teal-100 rounded-2xl p-5 flex-row items-center gap-4 border border-teal-200 active:opacity-90"
        >
          <View className="w-12 h-12 rounded-xl bg-primary/20 items-center justify-center">
            <Ionicons name="chatbubble-ellipses" size={28} color="#0D9488" />
          </View>
          <Text className="text-heading font-bold text-teal-900 flex-1">Ask Ka-agapay</Text>
          <Ionicons name="chevron-forward" size={24} color="#0D9488" />
        </Pressable>
      </View>

      {loading ? (
        <View className="py-6">
          <ActivityIndicator size="small" color="#0D9488" />
        </View>
      ) : (
        <>
          {nextAppointment && (
            <Pressable
              onPress={() => router.push(`/appointments/${nextAppointment.id}`)}
              className="bg-teal-50 rounded-2xl p-4 border border-teal-200 mb-4"
            >
              <Text className="text-body font-semibold text-teal-900 mb-2">📅 Susunod na appointment</Text>
              <Text className="text-body text-teal-800">
                {nextAppointment.preferredDate} • {nextAppointment.timeBlock} • {nextAppointment.rhuLocation}
              </Text>
              <Text className="text-body text-teal-700 mt-1">Q-{nextAppointment.queueNumber}</Text>
            </Pressable>
          )}

          {queueStatus && (
            <View className="bg-primary/10 rounded-2xl p-4 border border-primary/30">
              <Text className="text-body font-semibold text-teal-900 mb-2">🎟 Kasalukuyang pila</Text>
              <Text className="text-heading font-bold text-teal-900">
                Now serving: {queueStatus.nowServing}
              </Text>
              <Text className="text-body text-teal-800 mt-1">
                Tinatayang hintay: ~{queueStatus.estimatedWaitMinutes} min
              </Text>
              {queueStatus.isNext && (
                <Text className="text-body font-bold text-primary mt-2">Ikaw na ang susunod!</Text>
              )}
            </View>
          )}
        </>
      )}

      <Pressable
        onPress={() => router.push('/announcements')}
        className="mt-6 rounded-2xl py-3 border border-teal-300 flex-row items-center justify-center gap-2"
      >
        <Ionicons name="megaphone" size={22} color="#0D9488" />
        <Text className="text-body font-semibold text-teal-800">Mga anunsyo at health tips</Text>
      </Pressable>
    </ScrollView>
  );
}
