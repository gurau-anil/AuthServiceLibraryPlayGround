import httpClient from "../axios.config";

export type HistoryEventType = "Login" | "Create" | "Update" | "Delete";

export interface HistoryEntry {
  id: string;
  eventType: HistoryEventType;
  actorUserName?: string;
  targetUserName?: string;
  targetUserId?: string;
  timestamp: string;
  details?: string;
  ipAddress?: string;
}

function normalizeEntry(raw: any, index: number): HistoryEntry {
  return {
    id: raw.id ?? String(index),
    eventType: raw.eventType ?? raw.action ?? raw.type ?? "Login",
    actorUserName: raw.actorUserName ?? raw.performedBy ?? raw.userName ?? raw.actor,
    targetUserName: raw.targetUserName ?? raw.targetUser ?? raw.entityName,
    targetUserId: raw.targetUserId ?? raw.targetId,
    timestamp: raw.timestamp ?? raw.createdAt ?? raw.date ?? "",
    details: raw.details ?? raw.description ?? raw.message,
    ipAddress: raw.ipAddress ?? raw.ip,
  };
}

export async function getHistory(): Promise<HistoryEntry[]> {
  const result: any = await httpClient.get("/api/audit/history");
  const arr = Array.isArray(result.data) ? result.data : [];
  return arr.map((item: any, i: number) => normalizeEntry(item, i));
}
