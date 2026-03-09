"use server";

import { cookies } from "next/headers";

export async function setToken(token: string | undefined) {
  const cookieStore = await cookies();
  cookieStore.set("token", token || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function deleteToken() {
  const cookieStore = await cookies();
  cookieStore.delete("token");
}

export async function getToken() {
  const cookieStore = await cookies();
  return cookieStore.get("token")?.value;
}