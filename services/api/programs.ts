import type { HealthProgram } from "@/types";
import { api } from "./client";

export async function getPrograms(): Promise<HealthProgram[]> {
  const { data } = await api.get<HealthProgram[]>("/v1/programs");
  return data;
}

export async function getProgramById(id: string): Promise<HealthProgram> {
  const { data } = await api.get<HealthProgram>(`/v1/programs/${id}`);
  return data;
}
