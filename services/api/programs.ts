import { api } from './client';
import type { HealthProgram } from '@/types';

export async function getPrograms(): Promise<HealthProgram[]> {
  const { data } = await api.get<HealthProgram[]>('/programs');
  return data;
}

export async function getProgramById(id: string): Promise<HealthProgram> {
  const { data } = await api.get<HealthProgram>(`/programs/${id}`);
  return data;
}
