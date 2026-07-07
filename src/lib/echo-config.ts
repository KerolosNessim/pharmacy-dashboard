import Echo from "laravel-echo";
import Pusher from "pusher-js";

declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<"pusher"> | null = null;
let currentToken: string | null = null;
let currentRole: string | null = null;

async function authorizeChannel(
  channelName: string,
  socketId: string,
): Promise<Record<string, unknown>> {
  const response = await fetch("/api/broadcasting/auth", {
    method: "POST",
    credentials: "same-origin",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      socket_id: socketId,
      channel_name: channelName,
    }),
  });

  const text = await response.text();

  if (!response.ok) {
    let message = `Channel auth failed (${response.status})`;
    try {
      const error = JSON.parse(text) as { message?: string };
      if (error.message) message = error.message;
    } catch {
      if (text.trim()) message = text;
    }
    throw new Error(message);
  }

  if (!text.trim()) {
    throw new Error("Channel auth returned an empty response.");
  }

  try {
    return JSON.parse(text) as Record<string, unknown>;
  } catch {
    throw new Error("Channel auth returned invalid JSON.");
  }
}

export const initEcho = (token: string, role?: string | null) => {
  if (typeof window === "undefined") return null;

  if (echo && currentToken === token && currentRole === role) return echo;

  window.Pusher = Pusher;
  Pusher.logToConsole = process.env.NODE_ENV === "development";

  currentToken = token;
  currentRole = role || null;

  echo = new Echo<"pusher">({
    broadcaster: "pusher",
    key: "ea540644f44cd2d651cf",
    cluster: "eu",
    forceTLS: true,
    authorizer: (channel: { name: string }) => ({
      authorize: (
        socketId: string,
        callback: (error: Error | null, data: { auth: string } | null) => void,
      ) => {
        authorizeChannel(channel.name, socketId)
          .then((data) => callback(null, data as { auth: string }))
          .catch((error: Error) => callback(error, null));
      },
    }),
  });

  return echo;
};
