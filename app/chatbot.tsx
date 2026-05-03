// app/chatbot.tsx
import { useTts } from "@/hooks/useTts";
import { sendChatMessage } from "@/services/api/chatbot";
import type { ChatMessage } from "@/types";
import { CHATBOT_DISCLAIMER } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { format } from "date-fns"; // Note: Ensure you run 'npm install date-fns'
import { useRouter } from "expo-router";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const SUGGESTIONS = [
  "Ano ang bakuna ngayon?",
  "Bakit matagal ang pila?",
  "Paano mag-book?",
  "Anong oras bukas ang RHU?",
];

export default function ChatbotScreen() {
  const router = useRouter();
  const { speak } = useTts();
  const [conversationId] = useState(
    () => `chat-${Date.now()}-${Math.random().toString(36).slice(2)}`,
  );
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      // Initial greeting
      content:
        "Magandang araw! Ako si Ka-agapay Assistant. Tanong mo lang sa Filipino o English. " +
        CHATBOT_DISCLAIMER,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<FlatList>(null);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || loading) return;

    setInput("");
    const userMsg: ChatMessage = {
      role: "user",
      content: text,
      timestamp: new Date().toISOString(),
    };
    setMessages((m) => [...m, userMsg]);
    setLoading(true);

    try {
      const res = await sendChatMessage(text, conversationId);
      const assistantMsg: ChatMessage = {
        role: "assistant",
        content: res.message,
        timestamp: new Date().toISOString(),
      };
      setMessages((m) => [...m, assistantMsg]);
    } catch {
      const fallback: ChatMessage = {
        role: "assistant",
        content:
          "Pasensya, may problema sa server. Subukan muli o tumawag sa RHU.",
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

  const handleQuickAction = (action: "register" | "health" | "programs") => {
    if (action === "register") {
      router.push("/appointments/create");
    } else if (action === "health") {
      setInput("Kailangan ko ng health advice tungkol sa aking nararamdaman.");
    } else if (action === "programs") {
      router.push("/(tabs)/programs");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-100"
    >
      <View className="flex-1 px-2 pt-6 pb-2">
        <View className="flex-row items-center gap-2 mb-2">
          <Pressable onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#0F766E" />
          </Pressable>
          <Text className="text-body font-bold text-[#111827]">
            Ask Ka-agapay
          </Text>
        </View>

        <View className="bg-teal-50 rounded-xl p-3 mb-3 border border-teal-200">
          <Text className="text-sm text-[#111827]">{CHATBOT_DISCLAIMER}</Text>
          <Text className="text-xs text-teal-700 mt-2">
            Geminipowered chatbot para sa feature redirection, health advice, at
            event registration assistance.
          </Text>
        </View>

        <View className="bg-teal-50 rounded-3xl border border-teal-200 p-3 mb-4">
          <Text className="text-body font-semibold text-teal-900 mb-3">
            Quick actions
          </Text>
          <View className="flex-row flex-wrap gap-2">
            <Pressable
              onPress={() => handleQuickAction("register")}
              className="rounded-2xl bg-primary px-3 py-2"
            >
              <Text className="text-xs font-semibold text-white">
                Mag-register sa event
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleQuickAction("health")}
              className="rounded-2xl bg-primary px-3 py-2"
            >
              <Text className="text-xs font-semibold text-white">
                Health advice
              </Text>
            </Pressable>
            <Pressable
              onPress={() => handleQuickAction("programs")}
              className="rounded-2xl bg-primary px-3 py-2"
            >
              <Text className="text-xs font-semibold text-white">
                Tingnan ang programs
              </Text>
            </Pressable>
          </View>
        </View>

        {/* Chat Messages */}
        <FlatList
          data={messages}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item: msg }) => (
            <View
              className={`flex-row mb-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <View
                className={`max-w-[80%] rounded-xl px-4 py-3 ${
                  msg.role === "user"
                    ? "bg-primary rounded-br-none"
                    : "bg-white border border-gray-200 rounded-bl-none"
                } shadow-sm`}
              >
                <Text
                  className={`text-base ${msg.role === "user" ? "text-white" : "text-gray-800"}`}
                >
                  {msg.content}
                </Text>
                {msg.role === "assistant" && (
                  <Pressable
                    onPress={() => playAssistantMessage(msg.content)}
                    className="mt-2 flex-row items-center gap-1 self-start"
                  >
                    <Ionicons name="volume-high" size={20} color="#0D9488" />
                    <Text className="text-sm font-semibold text-primary">
                      Makinig
                    </Text>
                  </Pressable>
                )}
                <Text
                  className={`text-xs mt-1 ${msg.role === "user" ? "text-white/70" : "text-gray-500"} self-end`}
                >
                  {format(new Date(msg.timestamp), "hh:mm a")}
                </Text>
              </View>
            </View>
          )}
          className="flex-1 mb-2"
          ref={scrollRef}
          contentContainerStyle={{ paddingBottom: 8 }}
          inverted={false} // Display messages from bottom to top
          onContentSizeChange={() => {
            // This is a workaround for FlatList to scroll to end when new messages arrive
            // FlatList doesn't have scrollToEnd directly in its ref for some reason in some RN versions
            // For simplicity, we'll rely on auto-scroll when new items are added if inverted is false
            scrollRef.current?.scrollToEnd({ animated: true });
          }}
        />

        {loading && (
          <View className="flex-row justify-start mb-2">
            <View className="bg-white rounded-xl px-4 py-3 border border-gray-200 rounded-bl-none shadow-sm">
              <ActivityIndicator size="small" color="#0F766E" />
            </View>
          </View>
        )}

        <View className="flex-row flex-wrap gap-1 mb-2">
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setInput(s)}
              className="rounded-full bg-teal-100 px-3 py-1 border border-teal-200"
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
            placeholderTextColor="#6B7280"
            multiline
            maxLength={500}
            className="flex-1 text-xs text-[#111827] py-1 max-h-20"
            onSubmitEditing={handleSend}
          />
          <Pressable
            onPress={handleSend}
            disabled={!input.trim() || loading} // Disable send button if input is empty or loading
            className="bg-[#0F766E] rounded-lg p-1.5"
          >
            <Ionicons name="send" size={18} color="#FFFFFF" />
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
