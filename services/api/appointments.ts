import { api } from './client';
import type { Appointment, CreateAppointmentInput } from '@/types';

export async function createAppointment(
  input: CreateAppointmentInput
): Promise<Appointment> {
  const { data } = await api.post<Appointment>('/appointments', input);
  return data;
}

export async function getAppointmentsByUser(userId: string): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>(`/appointments/${userId}`);
  return data;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const { data } = await api.get<Appointment>(`/appointments/${id}`);
  return data;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/appointments/${id}/cancel`);
  return data;
}

export async function rescheduleAppointment(
  id: string,
  preferredDate: string,
  timeBlock: string
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(`/appointments/${id}/reschedule`, {
    preferredDate,
    timeBlock,
  });
  return data;
}
