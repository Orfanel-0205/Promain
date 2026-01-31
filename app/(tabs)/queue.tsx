import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/context/AuthContext';
import { getAppointmentsByUser } from '@/services/api/appointments';
import { getQueueStatus } from '@/services/api/queue';
import type { Appointment } from '@/types';
import type { QueueStatus } from '@/types/queue.types';

export default function QueueScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [activeAppointment, setActiveAppointment] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    (async () => {
      try {
        const appointments = await getAppointmentsByUser(user.id);
        const next = appointments
          .filter((a) => a.status === 'scheduled' || a.status === 'in_queue')
          .sort((a, b) => new Date(a.preferredDate).getTime() - new Date(b.preferredDate).getTime())[0] || null;
        setActiveAppointment(next);
        if (next?.id) {
          const q = await getQueueStatus(next.id);
          setQueueStatus(q);
        } else {
          setQueueStatus(null);
        }
      } catch {
        setActiveAppointment(null);
        setQueueStatus(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  if (!activeAppointment) {
    return (
      <View className="flex-1 bg-white px-6 pt-8">
        <Text className="text-heading-lg font-bold text-teal-900 mb-2">My Queue</Text>
        <View className="bg-teal-50 rounded-2xl p-6 border border-teal-200 mt-4">
          <Ionicons name="ticket-outline" size={48} color="#0D9488" style={{ alignSelf: 'center', marginBottom: 12 }} />
          <Text className="text-body text-teal-800 text-center mb-4">
            Wala kang aktibong pila ngayon.
          </Text>
          <Pressable
            onPress={() => router.push('/appointments/create')}
            className="bg-primary rounded-2xl py-4"
          >
            <Text className="text-center text-body font-bold text-white">Mag-book ng appointment</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-heading-lg font-bold text-teal-900 mt-2 mb-2">My Queue</Text>
      <Text className="text-body text-teal-800 mb-6">Status ng iyong pila.</Text>

      <View className="bg-primary rounded-2xl p-6 mb-4 shadow-md">
        <Text className="text-body text-white/90 mb-1">Iyong queue number</Text>
        <Text className="text-4xl font-bold text-white">Q-{activeAppointment.queueNumber}</Text>
        <Text className="text-body text-white/90 mt-2">
          {activeAppointment.rhuLocation} • {activeAppointment.preferredDate} {activeAppointment.timeBlock}
        </Text>
      </View>

      {queueStatus && (
        <>
          <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
            <Text className="text-body font-semibold text-teal-900 mb-2">🎟 Now serving</Text>
            <Text className="text-heading font-bold text-teal-900">{queueStatus.nowServing}</Text>
          </View>
          <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
            <Text className="text-body font-semibold text-teal-900 mb-2">⏱ Tinatayang hintay</Text>
            <Text className="text-heading font-bold text-teal-900">~{queueStatus.estimatedWaitMinutes} minuto</Text>
          </View>
          {queueStatus.isNext && (
            <View className="bg-primary/20 rounded-2xl p-4 border-2 border-primary">
              <Text className="text-heading font-bold text-teal-900 text-center">
                Ikaw na ang susunod! Pumunta na sa window ng RHU.
              </Text>
            </View>
          )}
          {queueStatus.priorityStatus !== 'regular' && (
            <Text className="text-body text-teal-700 mt-2">
              Priority: {queueStatus.priorityStatus}
            </Text>
          )}
        </>
      )}

      <Pressable
        onPress={() => router.push(`/appointments/${activeAppointment.id}`)}
        className="mt-6 rounded-2xl py-4 border-2 border-primary"
      >
        <Text className="text-center text-body font-bold text-primary">Tingnan ang appointment</Text>
      </Pressable>
    </ScrollView>
  );
}
