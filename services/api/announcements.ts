import { api } from './client';
import type { Announcement } from '@/types';

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.get<Announcement[]>('/announcements');
  return data;
}
