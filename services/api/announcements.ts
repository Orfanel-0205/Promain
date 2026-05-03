import type { Announcement } from "@/types";
import { api } from "./client";

export async function getAnnouncements(): Promise<Announcement[]> {
  const { data } = await api.get<Announcement[]>("/v1/announcements");
  return data;
}
