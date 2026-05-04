import { View, Text } from 'react-native';

export default function Header({ title }: { title: string }) {
  return (
    <View className="bg-primary p-4">
      <Text className="text-white text-lg font-bold">{title}</Text>
    </View>
  );
}
