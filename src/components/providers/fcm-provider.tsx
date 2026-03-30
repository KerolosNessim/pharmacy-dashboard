"use client";

import { useFCM } from "@/hooks/use-fcm";

export const FCMProvider = ({ children }: { children: React.ReactNode }) => {
  useFCM();
  return <>{children}</>;
};
