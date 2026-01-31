import { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getPrograms } from '@/services/api/programs';
import { useTts } from '@/hooks/useTts';
import type { HealthProgram } from '@/types';

const DEFAULT_PROGRAMS: HealthProgram[] = [
  { id: '1', name: 'Vaccination', nameFil: 'Bakuna', description: 'Routine and special vaccination programs.', descriptionFil: 'Bakuna para sa mga bata at matatanda.', schedule: 'Lunes–Biyernes, 8:00 AM–4:00 PM', availableSlots: 20, icon: 'medkit' },
  { id: '2', name: 'Feeding Program', nameFil: 'Feeding Program', description: 'Supplementary feeding for children.', descriptionFil: 'Libreng pagkain para sa mga bata.', schedule: 'Martes at Huwebes, 9:00 AM', availableSlots: 50, icon: 'medkit' },
  { id: '3', name: 'Immunization', nameFil: 'Immunization', description: 'Child immunization schedule.', descriptionFil: 'Bakuna ayon sa schedule ng bata.', schedule: 'Araw-araw', availableSlots: 15, icon: 'medkit' },
  { id: '4', name: 'Family Planning', nameFil: 'Family Planning', description: 'Counseling and services.', descriptionFil: 'Serbisyo at payo para sa pamilya.', schedule: 'Lunes–Biyernes', availableSlots: 10, icon: 'people' },
  { id: '5', name: 'Disease Prevention', nameFil: 'Disease Prevention', description: 'Health education and screening.', descriptionFil: 'Edukasyon at screening para sa kalusugan.', schedule: 'Araw-araw', availableSlots: 30, icon: 'shield-checkmark' },
];

export default function ProgramsScreen() {
  const { speak } = useTts();
  const [programs, setPrograms] = useState<HealthProgram[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPrograms()
      .then(setPrograms)
      .catch(() => setPrograms(DEFAULT_PROGRAMS))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0D9488" />
      </View>
    );
  }

  const list = programs.length ? programs : DEFAULT_PROGRAMS;

  return (
    <ScrollView className="flex-1 bg-white" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
      <Text className="text-heading-lg font-bold text-teal-900 mt-2 mb-2">Health Programs</Text>
      <Text className="text-body text-teal-800 mb-6">Mga programa ng RHU1 at RHU2, Malasiqui.</Text>

      {list.map((p) => (
        <View
          key={p.id}
          className="bg-teal-50 rounded-2xl p-4 mb-4 border border-teal-200"
        >
          <View className="flex-row items-start justify-between">
            <View className="flex-row items-center gap-3 mb-2">
              <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                <Ionicons name="medkit" size={22} color="#fff" />
              </View>
              <Text className="text-heading font-bold text-teal-900 flex-1">{p.nameFil || p.name}</Text>
            </View>
            <Pressable
              onPress={() => speak(`${p.nameFil || p.name}. ${p.descriptionFil || p.description}. Iskedyul: ${p.schedule}`)}
              className="rounded-xl bg-primary px-3 py-2 flex-row items-center gap-1"
            >
              <Ionicons name="volume-high" size={20} color="#fff" />
              <Text className="text-body font-semibold text-white">Makinig</Text>
            </Pressable>
          </View>
          <Text className="text-body text-teal-800 mb-1">{p.descriptionFil || p.description}</Text>
          <Text className="text-body text-teal-700">📅 {p.schedule}</Text>
          {p.availableSlots != null && (
            <Text className="text-body text-teal-600 mt-1">Available slots: {p.availableSlots}</Text>
          )}
        </View>
      ))}
    </ScrollView>
  );
}
