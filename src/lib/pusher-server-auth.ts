import crypto from "crypto";

const PUSHER_KEY =
  process.env.PUSHER_APP_KEY ?? "ea540644f44cd2d651cf";
const PUSHER_SECRET = process.env.PUSHER_APP_SECRET;

export function signPrivateChannel(
  socketId: string,
  channelName: string,
): { auth: string } | null {
  if (!PUSHER_SECRET) return null;

  const stringToSign = `${socketId}:${channelName}`;
  const signature = crypto
    .createHmac("sha256", PUSHER_SECRET)
    .update(stringToSign)
    .digest("hex");

  return { auth: `${PUSHER_KEY}:${signature}` };
}

export function canAccessPrivateChannel(
  channelName: string,
  role: string | undefined,
  pharmacyId: string | undefined,
): boolean {
  if (channelName === "private-chat.management") {
    return role === "super_admin";
  }

  const chatMatch = channelName.match(/^private-chat\.(\d+)$/);
  if (chatMatch) {
    if (role === "super_admin") return true;
    if (!pharmacyId) return false;
    // Own channel always allowed
    if (chatMatch[1] === pharmacyId) return true;
    // Cross-pharmacy chat: allow joining partner channels to send whispers
    return role === "pharmacist" || role === "supervisor" || role === "admin";
  }

  return false;
}
