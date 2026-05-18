import Echo from "laravel-echo";
import Pusher from "pusher-js";

// 👇 نضيف type للـ window
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<"pusher"> | null = null;
let currentToken: string | null = null;
let currentRole: string | null = null;

export const initEcho = (token: string, role?: string | null) => {
  if (typeof window === "undefined") return null;

  if (echo && currentToken === token && currentRole === role) return echo;

  window.Pusher = Pusher;
  // 👇 ده هيخلي كل الـ logs بتاعة Pusher تظهر في الكونسول (نجاح/فشل الاتصال)
  Pusher.logToConsole = true;

  currentToken = token;
  currentRole = role || null;
  echo = new Echo<"pusher">({
    broadcaster: "pusher",
    key: "ea540644f44cd2d651cf",
    cluster: "eu",
    forceTLS: true,
    authEndpoint: `${process.env.NEXT_PUBLIC_BASE_URL}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
        "accept-role": role || "",
      },
    },
  });

  return echo;
};
