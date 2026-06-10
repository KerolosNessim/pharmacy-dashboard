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
export async function setRole(role: string | undefined) {
  const cookieStore = await cookies();
  cookieStore.set("role", role || "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function deleteRole() {
  const cookieStore = await cookies();
  cookieStore.delete("role");
}

export async function getRole() {
  const cookieStore = await cookies();
  return cookieStore.get("role")?.value;
}

export async function setPharmacyId(pharmacyId: number | string | null | undefined) {
  const cookieStore = await cookies();
  const value =
    pharmacyId != null && String(pharmacyId).trim() !== ""
      ? String(pharmacyId)
      : "";

  if (!value) {
    cookieStore.delete("pharmacy_id");
    return;
  }

  cookieStore.set("pharmacy_id", value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });
}

export async function deletePharmacyId() {
  const cookieStore = await cookies();
  cookieStore.delete("pharmacy_id");
}

export async function getPharmacyId() {
  const cookieStore = await cookies();
  return cookieStore.get("pharmacy_id")?.value;
}