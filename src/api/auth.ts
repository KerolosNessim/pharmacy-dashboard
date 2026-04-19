import { apiRequest } from "@/lib/api-request";
import { RegisterValues } from "@/components/auth/register-form";
import { loginResponse, logoutResponse, registerResponse } from "@/types/auth";
import { loginValues } from "@/components/auth/login-form";
import { activateValues } from "@/components/auth/activate-form";
import { forgetPasswordValues } from "@/components/auth/forget-password-form";
import { resetPasswordValues } from "@/components/auth/reset-password-form";

export const registerApi = (data: RegisterValues) =>
  apiRequest<registerResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });


  export const loginApi = (data: loginValues) =>
    apiRequest<loginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    });

    export const logoutApi = () =>
    apiRequest<logoutResponse> ("/auth/logout", {
      method: "POST",
    });

    export const activateApi = (data: activateValues) =>
    apiRequest<loginResponse> ("/activate", {
      method: "POST",
      body: JSON.stringify(data),
    });

    export const forgetPasswordApi = (data: forgetPasswordValues) =>
    apiRequest<loginResponse> ("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    });

    export const resetPasswordApi = (data: resetPasswordValues & { token: string }) =>
    apiRequest<loginResponse> ("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    });
