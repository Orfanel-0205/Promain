// app/(tabs)/queue.tsx
import { useAuth } from "@/context/AuthContext";
import { getAppointmentsByUser } from "@/services/api/appointments";
import { getQueueStatus } from "@/services/api/queue";
import type { Appointment } from "@/types";
import type { QueueStatus } from "@/types/queue.types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

export default function QueueScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [activeAppointment, setActiveAppointment] =
    useState<Appointment | null>(null);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    (async () => {
      try {
        const appointmentsList = await getAppointmentsByUser(user.id);
        setAppointments(appointmentsList);

        const next =
          appointmentsList
            .filter((a) => a.status === "scheduled" || a.status === "in_queue")
            .sort(
              (a, b) =>
                new Date(a.preferredDate).getTime() -
                new Date(b.preferredDate).getTime(),
            )[0] || null;
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

  const queueItems = appointments
    .filter((a) => a.status === "scheduled" || a.status === "in_queue")
    .sort(
      (a, b) =>
        new Date(a.preferredDate).getTime() -
        new Date(b.preferredDate).getTime(),
    );

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
    >
      <Text className="text-heading-lg font-bold text-teal-900 mt-2 mb-2">
        My Queue
      </Text>
      <Text className="text-body text-teal-800 mb-6">
        Tingnan ang lahat ng iyong queue numbers at status.
      </Text>

      {queueItems.length > 0 ? (
        <View className="bg-teal-50 rounded-3xl p-4 mb-6 border border-teal-200">
          <Text className="text-body font-semibold text-teal-900 mb-3">
            Lahat ng queue numbers
          </Text>
          <View className="flex-row flex-wrap gap-3">
            {queueItems.map((item) => (
              <View
                key={item.id}
                className="rounded-2xl border border-teal-200 bg-white px-4 py-3"
              >
                <Text className="text-body text-teal-800">
                  Q-{item.queueNumber}
                </Text>
                <Text className="text-heading font-bold text-teal-900 mt-1">
                  {item.rhuLocation}
                </Text>
                <Text className="text-xs text-teal-500 mt-1">
                  {item.preferredDate}
                </Text>
                <Text className="text-xs text-teal-500">{item.timeBlock}</Text>
              </View>
            ))}
          </View>
        </View>
      ) : (
        <View className="rounded-3xl bg-teal-50 border border-teal-100 p-4 mb-6">
          <Text className="text-body text-teal-800">
            Wala kang aktibong queue ngayon. Mag-book ng appointment para
            magkaroon ng queue number.
          </Text>
        </View>
      )}

      {activeAppointment ? (
        <View className="bg-primary rounded-3xl p-6 mb-4 shadow-md">
          <Text className="text-body text-white/90 mb-1">
            Iyong kasalukuyang queue
          </Text>
          <Text className="text-4xl font-bold text-white">
            Q-{activeAppointment.queueNumber}
          </Text>
          <Text className="text-body text-white/90 mt-2">
            {activeAppointment.rhuLocation} • {activeAppointment.preferredDate}{" "}
            {activeAppointment.timeBlock}
          </Text>
        </View>
      ) : null}

      {queueStatus ? (
        <>
          <View className="bg-teal-50 rounded-3xl p-4 mb-4 border border-teal-200">
            <Text className="text-body font-semibold text-teal-900 mb-2">
              🎟 Now serving
            </Text>
            <Text className="text-heading font-bold text-teal-900">
              {queueStatus.nowServing}
            </Text>
          </View>
          <View className="bg-teal-50 rounded-3xl p-4 mb-4 border border-teal-200">
            <Text className="text-body font-semibold text-teal-900 mb-2">
              ⏱ Tinatayang hintay
            </Text>
            <Text className="text-heading font-bold text-teal-900">
              ~{queueStatus.estimatedWaitMinutes} minuto
            </Text>
          </View>
          {queueStatus.isNext && (
            <View className="bg-primary/20 rounded-3xl p-4 border-2 border-primary mb-4">
              <Text className="text-heading font-bold text-teal-900 text-center">
                Ikaw na ang susunod! Pumunta na sa window ng RHU.
              </Text>
            </View>
          )}
          {queueStatus.priorityStatus !== "regular" && (
            <Text className="text-body text-teal-700 mt-2">
              Priority: {queueStatus.priorityStatus}
            </Text>
          )}
        </>
      ) : null}

      <Pressable
        onPress={() =>
          activeAppointment
            ? router.push(`/appointments/${activeAppointment.id}`)
            : router.push("/appointments/create")
        }
        className="mt-6 rounded-3xl py-4 border-2 border-primary items-center"
      >
        <Text className="text-center text-body font-bold text-primary">
          {activeAppointment
            ? "Tingnan ang appointment"
            : "Mag-book ng appointment"}
        </Text>
      </Pressable>
    </ScrollView>
  );
}
