import { View, FlatList } from 'react-native';
import Header from '@/components/layout/Header';
import PatientCard from '@/components/patient/PatientCard';

const patients = [
  { id: '1', name: 'Juan Dela Cruz', age: 32 },
  { id: '2', name: 'Maria Santos', age: 28 },
];

export default function PatientsScreen() {
  return (
    <View className="flex-1 bg-background">
      <Header title="Patients" />

      <View className="p-6">
        <FlatList
          data={patients}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PatientCard {...item} />
          )}
        />
      </View>
    </View>
  );
}
