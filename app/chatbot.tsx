import { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { sendChatMessage } from '@/services/api/chatbot';
import { CHATBOT_DISCLAIMER } from '@/utils/constants';
import { useTts } from '@/hooks/useTts';
import type { ChatMessage } from '@/types';

const SUGGESTIONS = [
  'Ano ang bakuna ngayon?',
  'Bakit matagal ang pila?',
  'Paano mag-book?',
  'Anong oras bukas ang RHU?',
];

export default function ChatbotScreen() {
  const router = useRouter();
  const { speak } = useTts();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Magandang araw! Ako si Ka-agapay Assistant. Tanong mo lang sa Filipino o English. ' + CHATBOT_DISCLAIMER,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: new Date().toISOString() };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(text);
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: res.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
      setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 100);
    } catch {
      const fallback: ChatMessage = {
        role: 'assistant',
        content: 'Pasensya, may problema sa server. Subukan muli o tumawag sa RHU.',
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, fallback]);
    } finally {
      setLoading(false);
    }
  };

  const playAssistantMessage = (content: string) => {
    speak(content);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white"
    >
      <View className="flex-1 px-4 pt-12 pb-4">
        <View className="flex-row items-center gap-2 mb-4">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={28} color="#0D9488" />
          </Pressable>
          <Text className="text-heading font-bold text-teal-900">Ask Ka-agapay</Text>
        </View>

        <View className="bg-amber-50 rounded-2xl p-3 mb-4 border border-amber-200">
          <Text className="text-body text-amber-900">{CHATBOT_DISCLAIMER}</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 mb-4"
          contentContainerStyle={{ paddingBottom: 16 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View
              key={i}
              className={`mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-teal-50 border border-teal-200'
                }`}
              >
                <Text
                  className={`text-body ${msg.role === 'user' ? 'text-white' : 'text-teal-900'}`}
                >
                  {msg.content}
                </Text>
                {msg.role === 'assistant' && (
                  <Pressable
                    onPress={() => playAssistantMessage(msg.content)}
                    className="mt-2 flex-row items-center gap-1"
                  >
                    <Ionicons name="volume-high" size={18} color="#0D9488" />
                    <Text className="text-body font-semibold text-primary">Makinig</Text>
                  </Pressable>
                )}
              </View>
            </View>
          ))}
          {loading && (
            <View className="items-start mb-3">
              <View className="bg-teal-50 rounded-2xl px-4 py-3 border border-teal-200">
                <ActivityIndicator size="small" color="#0D9488" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="flex-row flex-wrap gap-2 mb-3">
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setInput(s)}
              className="rounded-xl bg-teal-100 px-3 py-2"
            >
              <Text className="text-body text-teal-800">{s}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center gap-2 bg-teal-50 rounded-2xl border border-teal-200 px-3 py-2">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type or voice input..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={500}
            className="flex-1 text-body text-teal-900 py-2 max-h-24"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || loading}
            className="bg-primary rounded-xl p-3"
          >
            <Ionicons name="send" size={24} color="#fff" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
