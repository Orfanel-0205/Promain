import { api } from './client';
import type { FeedbackInput } from '@/types';

export async function submitFeedback(input: FeedbackInput): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>('/feedback', input);
  return data;
}
