// app/(tabs)/index.tsx
import { DashboardCard } from "@/components/DashboardCard";
import { useAuth } from "@/context/AuthContext";
import { getAnnouncements } from "@/services/api/announcements";
import { getAppointmentsByUser } from "@/services/api/appointments";
import { getPrograms } from "@/services/api/programs";
import { getQueueStatus } from "@/services/api/queue";
import type { Announcement, Appointment, HealthProgram } from "@/types";
import type { QueueStatus } from "@/types/queue.types";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

const C = {
  primary: "#0D9488",
  primaryDark: "#0F766E",
  primaryLight: "#14B8A6",
  teal50: "#F0FDFA",
  teal100: "#CCFBF1",
  teal200: "#99F6E4",
  teal700: "#0F766E",
  teal800: "#115E59",
  teal900: "#134E4A",
  white: "#ffffff",
  gray100: "#F1F5F9",
};

const DEFAULT_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "1",
    title: "RHU Schedule",
    titleFil: "Oras ng RHU",
    body: "RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.",
    bodyFil: "RHU1 at RHU2 bukas Lunes–Biyernes, 8:00 AM–4:00 PM.",
    type: "announcement",
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Health Tip",
    titleFil: "Tip sa kalusugan",
    body: "Uminom ng 8 basong tubig araw-araw at kumain ng gulay at prutas.",
    bodyFil: "Uminom ng 8 basong tubig araw-araw at kumain ng gulay at prutas.",
    type: "health_tip",
    createdAt: new Date().toISOString(),
  },
];

const DEFAULT_PROGRAMS: HealthProgram[] = [
  {
    id: "1",
    name: "Vaccination",
    nameFil: "Bakuna",
    description: "Routine and special vaccination programs.",
    descriptionFil: "Bakuna para sa mga bata at matatanda.",
    schedule: "Lunes–Biyernes, 8:00 AM–4:00 PM",
    availableSlots: 20,
    icon: "medkit",
  },
  {
    id: "2",
    name: "Feeding Program",
    nameFil: "Feeding Program",
    description: "Supplementary feeding for children.",
    descriptionFil: "Libreng pagkain para sa mga bata.",
    schedule: "Martes at Huwebes, 9:00 AM",
    availableSlots: 50,
    icon: "medkit",
  },
];

export default function HomeScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [queueStatus, setQueueStatus] = useState<QueueStatus | null>(null);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;
    setLoading(true);
    (async () => {
      try {
        const [appointmentsResult, announcementsResult, programsResult] =
          await Promise.allSettled([
            getAppointmentsByUser(user.id),
            getAnnouncements(),
            getPrograms(),
          ]);

        const loadedAppointments =
          appointmentsResult.status === "fulfilled"
            ? appointmentsResult.value
            : [];
        setAppointments(loadedAppointments);

        const queueItems = loadedAppointments
          .filter((a) => a.status === "scheduled" || a.status === "in_queue")
          .sort(
            (a, b) =>
              new Date(a.preferredDate).getTime() -
              new Date(b.preferredDate).getTime(),
          );

        if (queueItems[0]?.id) {
          try {
            const q = await getQueueStatus(queueItems[0].id);
            setQueueStatus(q);
          } catch {
            setQueueStatus(null);
          }
        }

        setAnnouncements(
          announcementsResult.status === "fulfilled" &&
            announcementsResult.value.length
            ? announcementsResult.value
            : DEFAULT_ANNOUNCEMENTS,
        );
        setPrograms(
          programsResult.status === "fulfilled" && programsResult.value.length
            ? programsResult.value
            : DEFAULT_PROGRAMS,
        );
      } catch {
        setAnnouncements(DEFAULT_ANNOUNCEMENTS);
        setPrograms(DEFAULT_PROGRAMS);
      } finally {
        setLoading(false);
      }
    })();
  }, [user?.id]);

  const firstName = user?.firstName || user?.fullName?.split(" ")[0] || "User";
  const queueItems = appointments
    .filter((a) => a.status === "scheduled" || a.status === "in_queue")
    .sort(
      (a, b) =>
        new Date(a.preferredDate).getTime() -
        new Date(b.preferredDate).getTime(),
    );

  if (authLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={C.primary} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Header Card */}
      <View style={styles.headerCard}>
        <View style={styles.headerTop}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(
                user?.firstName?.[0] ||
                user?.fullName?.[0] ||
                "U"
              ).toUpperCase()}
            </Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.greeting}>Kumusta, {firstName}!</Text>
            <Text style={styles.barangay}>
              {user?.barangay || "Maligayang pagdating sa Ka-agapay"}
            </Text>
          </View>
        </View>
        <View style={styles.infoRow}>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Profile</Text>
            <Text style={styles.infoValue}>
              {user?.fullName || "Hindi available"}
            </Text>
          </View>
          <View style={styles.infoCard}>
            <Text style={styles.infoLabel}>Contact</Text>
            <Text style={styles.infoValue}>{user?.phone || "Wala"}</Text>
          </View>
        </View>
      </View>

      {/* Dashboard Cards */}
      <View style={styles.dashGrid}>
        <DashboardCard
          iconName="pulse"
          title="Talk to a Doctor"
          description="Kumonsulta sa doktor online"
          onPress={() => router.push("/appointments/create")}
          color={C.primary}
        />
        <DashboardCard
          iconName="chatbubbles"
          title="Ka-agapay Chat"
          description="Magtanong sa aming assistant"
          onPress={() => router.push("/chatbot")}
          color={C.primaryLight}
        />
        <DashboardCard
          iconName="calendar"
          title="My Appointments"
          description="Tingnan ang iyong mga appointment"
          onPress={() => router.push("/(tabs)/queue")}
          color={C.primaryDark}
        />
        <DashboardCard
          iconName="person"
          title="My Profile"
          description="I-update ang iyong impormasyon"
          onPress={() => router.push("/(tabs)/profile")}
          color="#065F46"
        />
      </View>

      {/* Announcements */}
      <Text style={styles.sectionTitle}>Mga bagong kaganapan at balita</Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={C.primary}
          style={{ marginBottom: 16 }}
        />
      ) : (
        announcements.slice(0, 2).map((a) => (
          <View key={a.id} style={styles.announcementCard}>
            <View style={styles.announcementHeader}>
              <Text style={styles.announcementTitle}>
                {a.titleFil || a.title}
              </Text>
              <Text style={styles.announcementDate}>
                {new Date(a.createdAt).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.announcementBody}>{a.bodyFil || a.body}</Text>
            <Pressable
              onPress={() => router.push("/announcements")}
              style={styles.viewAllBtn}
            >
              <Text style={styles.viewAllText}>Tingnan lahat</Text>
            </Pressable>
          </View>
        ))
      )}

      {/* Programs */}
      <Text style={styles.sectionTitle}>Programs ng RHU</Text>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={C.primary}
          style={{ marginBottom: 16 }}
        />
      ) : (
        programs.slice(0, 2).map((p) => (
          <View key={p.id} style={styles.programCard}>
            <Text style={styles.programName}>{p.nameFil || p.name}</Text>
            <Text style={styles.programDesc}>
              {p.descriptionFil || p.description}
            </Text>
            <Text style={styles.programSchedule}>📅 {p.schedule}</Text>
          </View>
        ))
      )}

      {/* Queue Numbers */}
      <Text style={styles.sectionTitle}>Iyong mga queue number</Text>
      {queueItems.length > 0 ? (
        <View style={styles.queueRow}>
          {queueItems.map((appt) => (
            <View key={appt.id} style={styles.queueCard}>
              <Text style={styles.queueNum}>Q-{appt.queueNumber}</Text>
              <Text style={styles.queueLocation}>{appt.rhuLocation}</Text>
              <Text style={styles.queueDate}>{appt.preferredDate}</Text>
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.emptyQueue}>
          <Text style={styles.emptyQueueText}>
            Wala pang aktibong pila. Mag-book ng appointment para makakuha ng
            queue number.
          </Text>
        </View>
      )}

      {/* View Programs Button */}
      <Pressable
        onPress={() => router.push("/(tabs)/programs")}
        style={styles.programsBtn}
      >
        <Text style={styles.programsBtnText}>
          Tingnan ang lahat ng programa
        </Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },

  // Header
  headerCard: {
    backgroundColor: C.teal50,
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.teal200,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
  },
  headerInfo: {
    flex: 1,
  },
  greeting: {
    fontSize: 20,
    fontWeight: "bold",
    color: C.teal900,
  },
  barangay: {
    fontSize: 14,
    color: C.teal700,
    marginTop: 2,
  },
  infoRow: {
    flexDirection: "row",
    gap: 10,
  },
  infoCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: C.teal100,
  },
  infoLabel: {
    fontSize: 13,
    color: C.teal700,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    fontWeight: "bold",
    color: C.teal900,
  },

  // Dashboard grid
  dashGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
    gap: 10,
  },

  // Section title
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: C.teal900,
    marginBottom: 12,
  },

  // Announcements
  announcementCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.teal100,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  announcementHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  announcementTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: C.teal900,
    flex: 1,
  },
  announcementDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginLeft: 8,
  },
  announcementBody: {
    fontSize: 14,
    color: C.teal800,
    lineHeight: 20,
    marginBottom: 12,
  },
  viewAllBtn: {
    alignSelf: "flex-start",
    backgroundColor: C.primary,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  viewAllText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#fff",
  },

  // Programs
  programCard: {
    backgroundColor: C.teal50,
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: C.teal200,
  },
  programName: {
    fontSize: 16,
    fontWeight: "bold",
    color: C.teal900,
    marginBottom: 4,
  },
  programDesc: {
    fontSize: 14,
    color: C.teal800,
    marginBottom: 6,
    lineHeight: 20,
  },
  programSchedule: {
    fontSize: 13,
    color: C.teal700,
  },

  // Queue
  queueRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginBottom: 20,
  },
  queueCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: C.teal200,
    minWidth: "45%",
  },
  queueNum: {
    fontSize: 20,
    fontWeight: "bold",
    color: C.primary,
  },
  queueLocation: {
    fontSize: 14,
    fontWeight: "600",
    color: C.teal900,
    marginTop: 2,
  },
  queueDate: {
    fontSize: 12,
    color: "#94A3B8",
    marginTop: 2,
  },
  emptyQueue: {
    backgroundColor: C.teal50,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: C.teal100,
  },
  emptyQueueText: {
    fontSize: 14,
    color: C.teal800,
    lineHeight: 20,
  },

  // Bottom button
  programsBtn: {
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.teal200,
    backgroundColor: C.teal100,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  programsBtnText: {
    fontSize: 15,
    fontWeight: "600",
    color: C.teal900,
  },
});
