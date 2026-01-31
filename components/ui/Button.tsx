import { Pressable, Text } from 'react-native';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary';
};

export default function Button({ title, onPress, variant = 'primary' }: Props) {
  const bg =
    variant === 'primary' ? 'bg-primary' : 'bg-secondary';

  return (
    <Pressable
      onPress={onPress}
      className={`${bg} py-3 rounded-xl items-center`}
    >
      <Text className="text-white font-semibold text-base">
        {title}
      </Text>
    </Pressable>
  );
}
