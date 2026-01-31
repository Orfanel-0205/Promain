import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

type Props = {
  id: string;
  name: string;
  age: number;
};

export default function PatientCard({ id, name, age }: Props) {
  const router = useRouter();

  return (
    <Pressable
      onPress={() => router.push(`/patients/${id}`)}
      className="bg-white rounded-xl p-4 mb-3 shadow"
    >
      <Text className="text-lg font-bold">
        🧍 {name}
      </Text>
      <Text className="text-gray-600">
        Edad: {age}
      </Text>

      <Text className="text-blue-600 mt-2 font-semibold">
        👉 Tingnan ang detalye
      </Text>
    </Pressable>
  );
}
