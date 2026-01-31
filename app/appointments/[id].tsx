import { useEffect, useState } from 'react';
import { View, Text, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getAppointmentById, cancelAppointment } from '@/services/api/appointments';
import { getQueueStatus } from '@/services/api/queue';
import type { Appointment } from '@/types';
import type { QueueStatus } from '@/types/queue.types';
import { SERVICE_TYPES } from '@/utils/constants';

export default function AppointmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getAppointmentById(id)
      .then((a) => {
        setAppointment(a);
        return getQueueStatus(a.id).catch(() => null);
      })
      .then(setQueueStatus)
      .catch(() => setAppointment(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleCancel = () => {
    if (!id) return;
    Alert.alert('', 'Kanselahin ang appointment na ito?', [
      { text: 'Hindi', style: 'cancel' },
      {
        text: 'Oo, kanselahin',
        style: 'destructive',
        onPress: () =>
          cancelAppointment(id)
            .then(() => router.back())
            .catch(() => Alert.alert('', 'Hindi makansela. Subukan muli.')),
      },
    ]);
  };

  if (loading || !appointment) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  const serviceLabel = SERVICE_TYPES.find((s) => s.value === appointment.serviceType)?.label || appointment.serviceType;

  return (
    <View className="flex-1 bg-white px-6 pt-12 pb-8">
      <Pressable onPress={() => router.back()} className="self-start mb-6">
        <Ionicons name="arrow-back" size={28} color="#0D9488" />
      </Pressable>

      <Text className="text-heading-lg font-bold text-teal-900 mb-4">Appointment</Text>

      <View className="bg-primary rounded-2xl p-4 mb-4">
        <Text className="text-body text-white/90">Queue number</Text>
        <Text className="text-3xl font-bold text-white">Q-{appointment.queueNumber}</Text>
      </View>

      <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
        <Text className="text-body text-teal-900">Serbisyo: {serviceLabel}</Text>
        <Text className="text-body text-teal-900 mt-1">Petsa: {appointment.preferredDate}</Text>
        <Text className="text-body text-teal-900 mt-1">Oras: {appointment.timeBlock}</Text>
        <Text className="text-body text-teal-900 mt-1">Lugar: {appointment.rhuLocation}</Text>
        {appointment.symptomsOrReason && (
          <Text className="text-body text-teal-900 mt-1">Dahilan: {appointment.symptomsOrReason}</Text>
        )}
      </View>

      {queueStatus && (
        <View className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200">
          <Text className="text-body font-semibold text-teal-900">Now serving: {queueStatus.nowServing}</Text>
          <Text className="text-body text-teal-800 mt-1">Tinatayang hintay: ~{queueStatus.estimatedWaitMinutes} min</Text>
          {queueStatus.isNext && (
            <Text className="text-body font-bold text-primary mt-2">Ikaw na ang susunod!</Text>
          )}
        </View>
      )}

      {(appointment.status === 'scheduled' || appointment.status === 'in_queue') && (
        <Pressable
          onPress={handleCancel}
          className="rounded-2xl py-4 border-2 border-red-200 bg-red-50"
        >
          <Text className="text-center text-body font-semibold text-red-700">Kanselahin ang appointment</Text>
        </Pressable>
      )}

      <Pressable
        onPress={() => router.push('/(tabs)/queue')}
        className="rounded-2xl py-4 bg-primary mt-4"
      >
        <Text className="text-center text-body font-bold text-white">Tingnan ang pila</Text>
      </Pressable>
    </View>
  );
}
