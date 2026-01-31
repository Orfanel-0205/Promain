import { api } from './client';

export type ChatbotMessageResponse = {
  message: string;
  suggestions?: string[];
};

export async function sendChatMessage(
  message: string,
  conversationId?: string
): Promise<ChatbotMessageResponse> {
  const { data } = await api.post<ChatbotMessageResponse>('/chatbot/message', {
    message,
    conversationId,
  });
  return data;
}
