import { useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { submitFeedback } from '@/services/api/feedback';
import { FEEDBACK_OPTIONS } from '@/utils/constants';
import { useTts } from '@/hooks/useTts';

const EMOJI_RATINGS = [
  { value: 1, emoji: '😞', label: 'Hindi maganda' },
  { value: 2, emoji: '😕', label: 'Medyo hindi' },
  { value: 3, emoji: '😐', label: 'Ok lang' },
  { value: 4, emoji: '🙂', label: 'Maganda' },
  { value: 5, emoji: '😊', label: 'Napakaganda' },
];

export default function FeedbackScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ appointmentId?: string }>();
  const { speak } = useTts();
  const [rating, setRating] = useState(0);
  const [option, setOption] = useState<'fast' | 'slow' | 'easy' | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating < 1) {
      Alert.alert('', 'Pumili ng rating (1–5).');
      return;
    }
    setLoading(true);
    try {
      await submitFeedback({
        appointmentId: params.appointmentId,
        rating,
        option: option || undefined,
      });
      setSubmitted(true);
      speak('Salamat sa iyong feedback!');
      setTimeout(() => router.back(), 1500);
    } catch {
      Alert.alert('', 'Hindi masagip ang feedback. Subukan muli.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <View className="flex-1 items-center justify-center bg-white px-6">
        <Text className="text-5xl mb-4">😊</Text>
        <Text className="text-heading font-bold text-teal-900 text-center">Salamat sa iyong feedback!</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <View className="px-4 pt-12 pb-4 flex-row items-center gap-2">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#0D9488" />
        </Pressable>
        <Text className="text-heading font-bold text-teal-900">Feedback</Text>
      </View>

      <ScrollView
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-body text-teal-800 mb-4">
          Gaano kahusay ang serbisyo ngayong araw? (1–5)
        </Text>
        <View className="flex-row justify-between mb-6">
          {EMOJI_RATINGS.map((r) => (
            <Pressable
              key={r.value}
              onPress={() => setRating(r.value)}
              className={`rounded-2xl p-3 items-center min-w-[56px] ${rating === r.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
            >
              <Text className="text-2xl">{r.emoji}</Text>
              <Text className={`text-body font-semibold mt-1 ${rating === r.value ? 'text-white' : 'text-teal-900'}`}>
                {r.value}
              </Text>
            </Pressable>
          ))}
        </View>

        <Text className="text-body font-semibold text-teal-900 mb-3">One-tap feedback (opsyonal)</Text>
        {FEEDBACK_OPTIONS.map((o) => (
          <Pressable
            key={o.value}
            onPress={() => setOption(option === o.value ? null : o.value)}
            className={`rounded-2xl p-4 mb-3 flex-row items-center gap-3 ${option === o.value ? 'bg-primary' : 'bg-teal-50 border border-teal-200'}`}
          >
            <Ionicons
              name={option === o.value ? 'checkmark-circle' : 'ellipse-outline'}
              size={24}
              color={option === o.value ? '#fff' : '#0D9488'}
            />
            <Text className={`text-body font-semibold flex-1 ${option === o.value ? 'text-white' : 'text-teal-900'}`}>
              {o.label}
            </Text>
          </Pressable>
        ))}

        <Pressable
          onPress={handleSubmit}
          disabled={loading || rating < 1}
          className="bg-primary rounded-2xl py-4 mt-6"
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text className="text-center text-body font-bold text-white">Ipadala ang feedback</Text>
          )}
        </Pressable>
      </ScrollView>
    </View>
  );
}
