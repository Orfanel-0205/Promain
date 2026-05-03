import type { Appointment, CreateAppointmentInput } from "@/types";
import { api } from "./client";

export async function createAppointment(
  input: CreateAppointmentInput,
): Promise<Appointment> {
  const { data } = await api.post<Appointment>("/v1/appointments", input);
  return data;
}

export async function getAppointmentsByUser(
  userId: string,
): Promise<Appointment[]> {
  const { data } = await api.get<Appointment[]>(`/v1/appointments/${userId}`);
  return data;
}

export async function getAppointmentById(id: string): Promise<Appointment> {
  const { data } = await api.get<Appointment>(`/v1/appointments/${id}`);
  return data;
}

export async function cancelAppointment(id: string): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(
    `/v1/appointments/${id}/cancel`,
  );
  return data;
}

export async function rescheduleAppointment(
  id: string,
  preferredDate: string,
  timeBlock: string,
): Promise<Appointment> {
  const { data } = await api.patch<Appointment>(
    `/v1/appointments/${id}/reschedule`,
    {
      preferredDate,
      timeBlock,
    },
  );
  return data;
}
