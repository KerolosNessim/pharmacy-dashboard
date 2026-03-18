import { apiRequest } from "@/lib/api-request";
import { AddRequestData, AddRequestResponse, TransferResponse } from "@/types/transfar";

export const addRequestApi = (data: AddRequestData) =>
  apiRequest<AddRequestResponse>("/supervisor/transfers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getRequestsApi = (params?: string) => {
  const url = params ? `/transfers${params}` : "/transfers";
  return apiRequest<TransferResponse>(url);
}

export const acceptRequestApi = (id: number) =>
  apiRequest<AddRequestResponse>(`/supervisor/transfers/${id}/approve`, {
    method: "POST",
  });
export const rejectRequestApi = (id: number,rejection_reason:string) =>
  apiRequest<AddRequestResponse>(`/supervisor/transfers/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ rejection_reason }),
  });
export const completeRequestApi = (id: number) =>
  apiRequest<AddRequestResponse>(`/supervisor/transfers/${id}/complete`, {
    method: "POST",
  });