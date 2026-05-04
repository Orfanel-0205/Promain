import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  StyleSheet,
  FlatList,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';


interface Doctor {
  id: string;
  name: string;
  specialty: string;
  imageUrl?: string;
  available: boolean;          
  rating: number;               
  nextAvailable?: string;      
}

interface ActiveSession {
  doctorId: string;
  doctorName: string;
  startedAt: string;
  elapsedMinutes: number;
}


const PLACEHOLDER_DOCTORS: Doctor[] = [
  { id: 'd1', name: 'Dr. Maria Santos',   specialty: 'General Practitioner', available: true,  rating: 4.8 },
  { id: 'd2', name: 'Dr. Juan dela Cruz', specialty: 'Pediatrician',         available: true,  rating: 4.6 },
  { id: 'd3', name: 'Dr. Ana Reyes',      specialty: 'OB-GYN',              available: false, rating: 4.9, nextAvailable: '2026-02-03T14:00:00' },
  { id: 'd4', name: 'Dr. Paolo Lim',      specialty: 'Dermatologist',        available: true,  rating: 4.5 },
  { id: 'd5', name: 'Dr. Rosa Aquino',    specialty: 'Hypertension Specialist', available: false, rating: 4.7, nextAvailable: '2026-02-04T09:00:00' },
  { id: 'd6', name: 'Dr. Marcos Vera',    specialty: 'General Practitioner', available: true,  rating: 4.3 },
];

const SPECIALTIES = ['Lahat', ...new Set(PLACEHOLDER_DOCTORS.map((d) => d.specialty))];


const fmtDateTime = (iso: string) => {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const h = d.getHours();
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  const min = String(d.getMinutes()).padStart(2, '0');
  return `${months[d.getMonth()]} ${d.getDate()} – ${h12}:${min} ${ampm}`;
};

const renderStars = (rating: number) => {
  const full = Math.floor(rating);
  const stars: string[] = [];
  for (let i = 0; i < 5; i++) stars.push(i < full ? '★' : '☆');
  return stars.join('');
};


function BookingModal({
  visible,
  doctor,
  onClose,
  onConfirm,
}: {
  visible: boolean;
  doctor: Doctor | null;
  onClose: () => void;
  onConfirm: (type: 'instant' | 'scheduled', concern: string) => void;
}) {
  const [concern, setConcern] = useState('');
  const [bookType, setBookType] = useState<'instant' | 'scheduled'>('instant');

  if (!doctor) return null;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          {/* Handle */}
          <View style={styles.modalHandle} />

          <Text style={styles.modalTitle}>Mag-book ng Konsultasyon</Text>
          <Text style={styles.modalSubtitle}>
            {doctor.name} · {doctor.specialty}
          </Text>

          {/* Instant vs Scheduled toggle */}
          <View style={styles.toggleRow}>
            {(['instant', 'scheduled'] as const).map((t) => (
              <Pressable
                key={t}
                onPress={() => setBookType(t)}
                style={[
                  styles.toggleOption,
                  bookType === t && styles.toggleOptionActive,
                ]}
              >
                <Ionicons
                  name={t === 'instant' ? 'flash' : 'calendar'}
                  size={18}
                  color={bookType === t ? '#FFFFFF' : '#115E59'}
                />
                <Text
                  style={[
                    styles.toggleOptionText,
                    bookType === t && styles.toggleOptionTextActive,
                  ]}
                >
                  {t === 'instant' ? 'Instant' : 'Schedule'}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Concern textarea */}
          <Text style={styles.modalLabel}>Ano ang iyong concern?</Text>
          <TextInput
            multiline
            numberOfLines={4}
            value={concern}
            onChangeText={setConcern}
            placeholder="Isulat ang iyong sakit o tanong…"
            placeholderTextColor="#94A3B8"
            style={styles.modalTextArea}
          />

          {/* Buttons */}
          <View style={styles.modalButtons}>
            <Pressable onPress={onClose} style={styles.modalBtnCancel}>
              <Text style={styles.modalBtnCancelText}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(bookType, concern)}
              style={styles.modalBtnConfirm}
            >
              <Text style={styles.modalBtnConfirmText}>
                {bookType === 'instant' ? 'Simulan ang Konsultasyon' : 'I-confirm ang Schedule'}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}


export default function TelemedicineScreen() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSpecialty, setActiveSpecialty] = useState('Lahat');

  
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);
  const [showBooking, setShowBooking] = useState(false);

  
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);

 
  const fetchDoctors = useCallback(async () => {
    
    setDoctors(PLACEHOLDER_DOCTORS);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDoctors();
  }, [fetchDoctors]);

  const filtered =
    activeSpecialty === 'Lahat'
      ? doctors
      : doctors.filter((d) => d.specialty === activeSpecialty);

  
  const handleConfirmBooking = (type: 'instant' | 'scheduled', concern: string) => {
    setShowBooking(false);
    if (type === 'instant' && bookingDoctor) {
      
      setActiveSession({
        doctorId: bookingDoctor.id,
        doctorName: bookingDoctor.name,
        startedAt: new Date().toISOString(),
        elapsedMinutes: 0,
      });
      Alert.alert('Konsultasyon Nagsimula', `Konektado ka na sa ${bookingDoctor.name}.`);
    } else {
      Alert.alert('Na-schedule!', `Ang iyong konsultasyon ay na-schedule na. Abangan ang confirmation.`);
    }
    setBookingDoctor(null);
  };

  
  const renderDoctorCard = ({ item: doc }: { item: Doctor }) => (
    <View style={styles.doctorCard}>
      {/* Avatar circle */}
      <View style={[styles.doctorAvatar, !doc.available && styles.doctorAvatarOffline]}>
        <Ionicons name="person" size={36} color="#FFFFFF" />
        {/* Online dot */}
        <View
          style={[
            styles.onlineDot,
            { backgroundColor: doc.available ? '#22C55E' : '#94A3B8' },
          ]}
        />
      </View>

      {/* Info */}
      <View style={styles.doctorInfo}>
        <Text style={styles.doctorName}>{doc.name}</Text>
        <Text style={styles.doctorSpecialty}>{doc.specialty}</Text>
        <View style={styles.doctorMeta}>
          <Text style={styles.doctorRating}>{renderStars(doc.rating)} {doc.rating}</Text>
          <Text style={[styles.doctorStatus, { color: doc.available ? '#22C55E' : '#94A3B8' }]}>
            {doc.available ? 'Available' : 'Busy'}
          </Text>
        </View>
        {!doc.available && doc.nextAvailable && (
          <Text style={styles.doctorNextAvail}>
            Susunod na available: {fmtDateTime(doc.nextAvailable)}
          </Text>
        )}
      </View>

      {/* Action button */}
      <Pressable
        onPress={() => {
          setBookingDoctor(doc);
          setShowBooking(true);
        }}
        style={[
          styles.doctorBookBtn,
          !doc.available && styles.doctorBookBtnDisabled,
        ]}
        disabled={!doc.available}
      >
        <Ionicons name="videocam" size={18} color="#FFFFFF" />
      </Pressable>
    </View>
  );

  
  const renderActiveSession = () => {
    if (!activeSession) return null;
    return (
      <View style={styles.sessionCard}>
        <View style={styles.sessionHeader}>
          <Ionicons name="video" size={22} color="#FFFFFF" />
          <Text style={styles.sessionHeaderText}>Live Konsultasyon</Text>
          <Pressable
            onPress={() => {
              Alert.alert('Tapusin ang Konsultasyon', 'Sure ka bang gusto mong i-end ang call?', [
                { text: 'Cancel' },
                { text: 'Tapusin', style: 'destructive', onPress: () => setActiveSession(null) },
              ]);
            }}
            style={styles.sessionEndBtn}
          >
            <Text style={styles.sessionEndBtnText}>End</Text>
          </Pressable>
        </View>

        {/* Video placeholder */}
        <View style={styles.videoPlaceholder}>
          <View style={styles.videoRemote}>
            <Ionicons name="person" size={64} color="rgba(255,255,255,0.3)" />
            <Text style={styles.videoRemoteName}>{activeSession.doctorName}</Text>
          </View>
          <View style={styles.videoLocal}>
            <Ionicons name="person" size={28} color="rgba(255,255,255,0.6)" />
            <Text style={styles.videoLocalLabel}>Ikaw</Text>
          </View>
        </View>

        {/* Controls */}
        <View style={styles.sessionControls}>
          {[
            { icon: 'mic' as const,       label: 'Mic' },
            { icon: 'camera' as const,    label: 'Camera' },
            { icon: 'chat-bubble' as const, label: 'Chat' },
          ].map((ctrl) => (
            <Pressable key={ctrl.icon} style={styles.controlBtn}>
              <Ionicons name={ctrl.icon} size={22} color="#115E59" />
              <Text style={styles.controlBtnLabel}>{ctrl.label}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  };

  
  if (loading) {
    return (
      <View style={styles.centred}>
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      {/* Title bar */}
      <View style={styles.headerRow}>
        <Text style={styles.headerTitle}>Telemedicine</Text>
        <Ionicons name="help-circle-outline" size={22} color="#115E59" />
      </View>

      <ScrollView style={styles.scrollBody} showsVerticalScrollIndicator={false}>
        {/* Active session (appears on top when live) */}
        {renderActiveSession()}

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Ionicons name="information-circle" size={20} color="#0D9488" />
          <Text style={styles.infoBannerText}>
            Mag-konsulta online sa mga doktor nang libre. Piliin ang isang available na doktor para magsimula.
          </Text>
        </View>

        {/* Specialty filter pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterBar}
        >
          {SPECIALTIES.map((s) => (
            <Pressable
              key={s}
              onPress={() => setActiveSpecialty(s)}
              style={[
                styles.filterPill,
                activeSpecialty === s && styles.filterPillActive,
              ]}
            >
              <Text
                style={[
                  styles.filterPillText,
                  activeSpecialty === s && styles.filterPillTextActive,
                ]}
              >
                {s}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Doctor list */}
        <FlatList
          data={filtered}
          keyExtractor={(d) => d.id}
          renderItem={renderDoctorCard}
          scrollEnabled={false}
          ListEmptyComponent={
            <View style={styles.centred}>
              <Ionicons name="sad-outline" size={40} color="#94A3B8" />
              <Text style={styles.emptyText}>Walang doktor para sa specialty na ito.</Text>
            </View>
          }
        />
      </ScrollView>

      {/* Booking modal */}
      <BookingModal
        visible={showBooking}
        doctor={bookingDoctor}
        onClose={() => setShowBooking(false)}
        onConfirm={handleConfirmBooking}
      />
    </View>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F8FFFE' },

  // Header
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 56,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#115E59' },
  scrollBody: { flex: 1 },

  // Info banner
  infoBanner: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: '#F0FDFA',
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 8,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  infoBannerText: { flex: 1, fontSize: 14, color: '#115E59', lineHeight: 20 },

  // Filters
  filterBar: { paddingHorizontal: 16, paddingVertical: 8, flexDirection: 'row', gap: 8 },
  filterPill: {
    backgroundColor: '#F0FDFA',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  filterPillActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  filterPillText: { fontSize: 14, color: '#115E59', fontWeight: '600' },
  filterPillTextActive: { color: '#FFFFFF' },

  // Doctor card
  doctorCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
    gap: 12,
  },
  doctorAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorAvatarOffline: { backgroundColor: '#94A3B8' },
  onlineDot: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  doctorInfo: { flex: 1 },
  doctorName: { fontSize: 16, fontWeight: 'bold', color: '#115E59' },
  doctorSpecialty: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  doctorMeta: { flexDirection: 'row', gap: 12, marginTop: 4, alignItems: 'center' },
  doctorRating: { fontSize: 13, color: '#F59E0B', fontWeight: '600' },
  doctorStatus: { fontSize: 13, fontWeight: '600' },
  doctorNextAvail: { fontSize: 12, color: '#94A3B8', marginTop: 2 },
  doctorBookBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#0D9488',
    alignItems: 'center',
    justifyContent: 'center',
  },
  doctorBookBtnDisabled: { backgroundColor: '#94A3B8' },

  // Active session card
  sessionCard: {
    backgroundColor: '#0D9488',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    overflow: 'hidden',
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    gap: 8,
  },
  sessionHeaderText: { flex: 1, fontSize: 16, fontWeight: 'bold', color: '#FFFFFF' },
  sessionEndBtn: {
    backgroundColor: '#EF4444',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  sessionEndBtnText: { color: '#FFFFFF', fontWeight: 'bold', fontSize: 14 },

  // Video placeholder
  videoPlaceholder: {
    height: 220,
    backgroundColor: '#1A3A38',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  videoRemote: { alignItems: 'center' },
  videoRemoteName: { color: '#FFFFFF', fontSize: 15, marginTop: 8, fontWeight: '600' },
  videoLocal: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 80,
    height: 100,
    borderRadius: 10,
    backgroundColor: '#2A5A58',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  videoLocalLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginTop: 4 },

  // Session controls
  sessionControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 24,
    padding: 14,
    backgroundColor: '#FFFFFF',
  },
  controlBtn: { alignItems: 'center', gap: 4 },
  controlBtnLabel: { fontSize: 12, color: '#115E59' },

  // Booking modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingBottom: 40,
  },
  modalHandle: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: '#E5E7EB',
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#115E59', textAlign: 'center' },
  modalSubtitle: { fontSize: 14, color: '#6B7280', textAlign: 'center', marginBottom: 16 },

  // Instant / Schedule toggle
  toggleRow: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  toggleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    borderRadius: 12,
    paddingVertical: 10,
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
  },
  toggleOptionActive: { backgroundColor: '#0D9488', borderColor: '#0D9488' },
  toggleOptionText: { fontSize: 15, fontWeight: '600', color: '#115E59' },
  toggleOptionTextActive: { color: '#FFFFFF' },

  // Concern input
  modalLabel: { fontSize: 14, fontWeight: '600', color: '#115E59', marginBottom: 6 },
  modalTextArea: {
    backgroundColor: '#F0FDFA',
    borderWidth: 1,
    borderColor: '#99F6E4',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#115E59',
    marginBottom: 20,
    minHeight: 100,
    textAlignVertical: 'top',
  },

  // Modal buttons
  modalButtons: { flexDirection: 'row', gap: 8 },
  modalBtnCancel: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  modalBtnCancelText: { fontSize: 15, color: '#6B7280', fontWeight: '600' },
  modalBtnConfirm: {
    flex: 1.4,
    backgroundColor: '#0D9488',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  modalBtnConfirmText: { fontSize: 15, color: '#FFFFFF', fontWeight: 'bold' },

  // Shared
  centred: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingVertical: 40 },
  emptyText: { marginTop: 10, color: '#94A3B8', fontSize: 15 },
});