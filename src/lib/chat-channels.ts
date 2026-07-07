export function getOwnChatChannelName(
  user: { role?: string; pharmacy_id?: number | string } | null,
): string | null {
  if (!user) return null;
  if (user.role === "super_admin") return "chat.management";
  if (user.pharmacy_id == null) return null;
  return `chat.${user.pharmacy_id}`;
}
