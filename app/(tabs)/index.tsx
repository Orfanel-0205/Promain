// app/(tabs)/index.tsx
import { DashboardCard } from "@/components/DashboardCard";
import { useAuth } from "@/context/AuthContext";
import { getAnnouncements } from "@/services/api/announcements";
import { getAppointmentsByUser } from "@/services/api/appointments";
import { getPrograms } from "@/services/api/programs";
import { getQueueStatus } from "@/services/api/queue";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

/* ─── Types (FIX: avoid "@/types" broken exports) ─── */
type Announcement = {
  id: string;
  title: string;
  titleFil?: string;
  body: string;
  bodyFil?: string;
};

type Appointment = {
  id: string;
  preferredDate: string;
  queueNumber: number;
  status: string;
};

type HealthProgram = {
  id: string;
  name: string;
  nameFil?: string;
  description: string;
  descriptionFil?: string;
};

type QueueStatus = {
  nowServing: string;
  estimatedWaitMinutes: number;
};

const C = {
  primary: "#0D9488",
  primaryLight: "#14B8A6",
  teal50: "#F0FDFA",
  teal700: "#0F766E",
  teal900: "#134E4A",
};

/* ─── Default Data ─── */
const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "RHU Schedule",
    titleFil: "Oras ng RHU",
    body: "RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.",
    bodyFil: "RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.",
  },
];

const DEFAULT_PROGRAMS: HealthProgram[] = [
  {
    id: "1",
    name: "Vaccination",
    nameFil: "Bakuna",
    description: "Routine vaccination programs.",
    descriptionFil: "Bakuna para sa lahat.",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [nextAppointment, setNextAppointment] = useState<Appointment | null>(
    null,
  );
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* ✔️ FIX: safe user name handling */
  const firstName =
    (user as any)?.firstName ||
    (user as any)?.fullName?.split(" ")[0] ||
    "User";

  /* ─── LOAD DATA ─── */
  const loadData = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);

    try {
      const [appointmentsData, announcementsData, programsData] =
        await Promise.all([
          getAppointmentsByUser(String(user.id)), // ✔️ FIX: force string
          getAnnouncements(),
          getPrograms(),
        ]);

      setAppointments(appointmentsData);

      const upcoming =
        appointmentsData
          .filter((a) => a.status === "scheduled" || a.status === "in_queue")
          .sort(
            (a, b) =>
              new Date(a.preferredDate).getTime() -
              new Date(b.preferredDate).getTime(),
          )[0] || null;

      setNextAppointment(upcoming);

      if (upcoming?.id) {
        const q = await getQueueStatus(String(upcoming.id)); // ✔️ FIX
        setQueueStatus(q);
      }

      setAnnouncements(
        announcementsData?.length ? announcementsData : DEFAULT_ANNOUNCEMENTS,
      );

      setPrograms(programsData?.length ? programsData : DEFAULT_PROGRAMS);
    } catch {
      setAnnouncements(DEFAULT_ANNOUNCEMENTS);
      setPrograms(DEFAULT_PROGRAMS);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadData} />
      }
    >
      {/* Header */}
      <View style={styles.headerCard}>
        <Text style={styles.greeting}>Kumusta, {firstName}!</Text>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.dashGrid}>
        <DashboardCard
          iconName="pulse"
          title="Talk to a Doctor"
          description="Kumonsulta sa doktor online" // ✔️ FIX
          onPress={() => router.push("/appointments/create")}
          color={C.primary}
        />

        <DashboardCard
          iconName="chatbubbles"
          title="Ka-agapay Chat"
          description="Magtanong sa assistant" // ✔️ FIX
          onPress={() => router.push("/chatbot")}
          color={C.primaryLight}
        />
      </View>

      {/* Appointment */}
      {nextAppointment && (
        <View style={styles.card}>
          <Text style={styles.title}>Next Appointment</Text>
          <Text>
            {nextAppointment.preferredDate} • Q-{nextAppointment.queueNumber}
          </Text>
        </View>
      )}

      {/* Queue */}
      {queueStatus && (
        <View style={styles.card}>
          <Text style={styles.title}>
            Now Serving: {queueStatus.nowServing}
          </Text>
          <Text>Est. wait: {queueStatus.estimatedWaitMinutes} mins</Text>
        </View>
      )}

      {/* Announcements */}
      <Text style={styles.sectionTitle}>Announcements</Text>
      {announcements.slice(0, 2).map((a) => (
        <View key={a.id} style={styles.card}>
          <Text style={styles.title}>{a.titleFil || a.title}</Text>
          <Text>{a.bodyFil || a.body}</Text>
        </View>
      ))}

      {/* Programs */}
      <Text style={styles.sectionTitle}>Programs</Text>
      {programs.slice(0, 2).map((p) => (
        <View key={p.id} style={styles.card}>
          <Text style={styles.title}>{p.nameFil || p.name}</Text>
          <Text>{p.descriptionFil || p.description}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

/* ─── Styles ─── */
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  content: { padding: 16, paddingBottom: 40 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },

  headerCard: {
    backgroundColor: C.teal50,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },

  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: C.teal900,
  },

  dashGrid: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 20,
  },

  card: {
    padding: 14,
    borderRadius: 12,
    backgroundColor: "#F9FAFB",
    marginBottom: 10,
  },

  title: { fontWeight: "bold", marginBottom: 4 },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: C.teal900,
  },
});
