import { View } from 'react-native';

export default function Card({ children }: { children: React.ReactNode }) {
  return (
    <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
      {children}
    </View>
  );
}
