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
      <View className="flex-1 px-2 pt-6 pb-2">
        <View className="flex-row items-center gap-2 mb-2">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0F766E" />
          </Pressable>
          <Text className="text-body font-bold text-[#111827]">Ask Ka-agapay</Text>
        </View>

        <View className="bg-[#F3F4F6] rounded-xl p-2 mb-2 border border-[#0F766E]">
          <Text className="text-sm text-[#111827]">{CHATBOT_DISCLAIMER}</Text>
        </View>

        <ScrollView
          ref={scrollRef}
          className="flex-1 mb-2"
          contentContainerStyle={{ paddingBottom: 8 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
        >
          {messages.map((msg, i) => (
            <View
              key={i}
              className={`mb-3 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <View
                className={`max-w-[85%] rounded-2xl px-3 py-2 ${
                  msg.role === 'user' ? 'bg-primary' : 'bg-teal-50 border border-teal-200'
                }`}
              >
                <Text
                  className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-teal-900'}`}
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
            <View className="items-start mb-2">
              <View className="bg-[#F3F4F6] rounded-2xl px-3 py-2 border border-[#0F766E]">
                <ActivityIndicator size="small" color="#0F766E" />
              </View>
            </View>
          )}
        </ScrollView>

        <View className="flex-row flex-wrap gap-1 mb-2">
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setInput(s)}
              className="rounded-lg bg-[#F3F4F6] px-2 py-1 border border-[#0F766E]"
            >
              <Text className="text-xs text-[#111827]">{s}</Text>
            </Pressable>
          ))}
        </View>

        <View className="flex-row items-center gap-1 bg-[#F3F4F6] rounded-2xl border border-[#0F766E] px-2 py-1">
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type or voice input..."
            placeholderTextColor="#94A3B8"
            multiline
            maxLength={500}
            className="flex-1 text-xs text-[#111827] py-1 max-h-20"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || loading}
            className="bg-[#0F766E] rounded-lg p-1.5"
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
