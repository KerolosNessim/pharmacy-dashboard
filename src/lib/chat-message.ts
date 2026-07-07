import type { Message } from "@/types/chat";

/** Normalizes varying Laravel chat/send response shapes. */
export function parseChatSendResponse(data: unknown): Message | null {
  if (!data || typeof data !== "object") return null;

  const root = data as Record<string, unknown>;
  const nested = root.data;
  const candidate =
    root.message ??
    (nested && typeof nested === "object"
      ? (nested as Record<string, unknown>).message ?? nested
      : null);

  if (candidate && typeof candidate === "object" && "id" in candidate) {
    return candidate as Message;
  }

  return null;
}
