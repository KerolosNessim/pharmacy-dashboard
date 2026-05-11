"use server";
import { getRole, getToken } from "@/actions/auth";
import { compressImage } from "./image-utils";


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

  if (isFormData) {
    const formData = options!.body as FormData;
    for (const [key, value] of Array.from(formData.entries())) {
      if (
        value instanceof File &&
        value.type.startsWith("image/") &&
        !value.type.includes("gif") &&
        !value.type.includes("svg")
      ) {
        try {
          console.log(`[Compression] Starting for ${key}: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)} MB)`);
          const { buffer, fileName, contentType } = await compressImage(value);
          const compressedFile = new File([buffer], fileName, {
            type: contentType,
          });
          formData.set(key, compressedFile);
          console.log(`[Compression] Finished: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
        } catch (error) {
          console.error("[Compression] Error:", error);
        }
      }
    }
    options!.body = formData;
  }

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

  for (const [key, value] of Array.from(formData.entries())) {
    if (
      value instanceof File &&
      value.type.startsWith("image/") &&
      !value.type.includes("gif") &&
      !value.type.includes("svg")
    ) {
      try {
        console.log(`[Compression Form] Starting for ${key}: ${value.name} (${(value.size / 1024 / 1024).toFixed(2)} MB)`);
        const { buffer, fileName, contentType } = await compressImage(value);
        const compressedFile = new File([buffer], fileName, {
          type: contentType,
        });
        formData.set(key, compressedFile);
        console.log(`[Compression Form] Finished: ${fileName} (${(buffer.length / 1024 / 1024).toFixed(2)} MB)`);
      } catch (error) {
        console.error("[Compression Form] Error:", error);
      }
    }
  }

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
