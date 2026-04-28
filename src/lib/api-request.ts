"use server";
import { getRole, getToken } from "@/actions/auth";

export type ApiResponse<T> = {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
};

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  const token = await getToken();
  const role = await getRole();
  const isFormData = options?.body instanceof FormData;
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        ...(isFormData
          ? {} 
          : {
              "Content-Type": "application/json",
              Accept: "application/json",
            }),
        Authorization: `Bearer ${token}`,
        "accept-role": role || "",
        ...(options?.headers || {}),
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || "Something went wrong",
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
}

export async function apiFormDataRequest<T>(
  endpoint: string,
  formData: FormData,
  method: string = "POST"
): Promise<ApiResponse<T>> {
  const token = await getToken();
  const role = await getRole();
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method,
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`,
        "accept-role": role || "",
      },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      return {
        ok: false,
        status: response.status,
        error: data?.message || "Something went wrong",
      };
    }

    return {
      ok: true,
      status: response.status,
      data,
    };
  } catch (error) {
    return {
      ok: false,
      status: 500,
      error: "Network error",
    };
  }
}
