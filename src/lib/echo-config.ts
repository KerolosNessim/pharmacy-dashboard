import Echo from "laravel-echo";
import Pusher from "pusher-js";

// 👇 نضيف type للـ window
declare global {
  interface Window {
    Pusher: typeof Pusher;
  }
}

let echo: Echo<"pusher"> | null = null;

export const initEcho = (token: string) => {
  if (typeof window === "undefined") return null;

  if (echo) return echo;

  window.Pusher = Pusher;
  // 👇 ده هيخلي كل الـ logs بتاعة Pusher تظهر في الكونسول (نجاح/فشل الاتصال)
  Pusher.logToConsole = true;

  echo = new Echo<"pusher">({
    broadcaster: "pusher",
    key: "45aaffc024ffed97e1cd",
    cluster: "eu",
    forceTLS: true,
    authEndpoint: "http://localhost:8000/api/broadcasting/auth",
    auth: {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/json",
      },
    },
  });

  return echo;
};