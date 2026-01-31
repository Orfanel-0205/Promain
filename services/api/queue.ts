import { api } from './client';
import type { QueueStatus } from '@/types';

export async function getQueueStatus(appointmentId: string): Promise<QueueStatus> {
  const { data } = await api.get<QueueStatus>(`/queue/status/${appointmentId}`);
  return data;
}
