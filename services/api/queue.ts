import type { QueueStatus } from "@/types";
import { api } from "./client";

export async function getQueueStatus(
  appointmentId: string,
): Promise<QueueStatus> {
  const { data } = await api.get<QueueStatus>(
    `/v1/queue/status/${appointmentId}`,
  );
  return data;
}
