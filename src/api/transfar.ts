import { apiRequest } from "@/lib/api-request";
import { AddRequestData, AddRequestResponse, SendReportData, TransferResponse } from "@/types/transfar";

export const addRequestApi = (data: AddRequestData) =>
  apiRequest<AddRequestResponse>("/transfers", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getRequestsApi = (params?: string) => {  
  const url = params ? `/transfers${params}` : "/transfers";
  return apiRequest<TransferResponse>(url);
}


export const acceptRequestApi = (id: number, notes?: string) =>
  apiRequest<AddRequestResponse>(`/transfers/${id}/approve`, {
    method: "POST",
    body: notes ? JSON.stringify({ notes }) : undefined,
  });
export const rejectRequestApi = (id: number, notes: string) =>
  apiRequest<AddRequestResponse>(`/transfers/${id}/reject`, {
    method: "POST",
    body: JSON.stringify({ notes }),
  });
export const activateRequestApi = (id: number) =>
  apiRequest<AddRequestResponse>(`/transfers/${id}/activate`, {
    method: "POST",
  });
export const completeRequestApi = (id: number) =>
  apiRequest<AddRequestResponse>(`/transfers/${id}/complete`, {
    method: "POST",
  });

export const sendReportApi = (data: SendReportData) =>
  apiRequest<AddRequestResponse>("/reports/send-transfer-report", {
    method: "POST",
    body: JSON.stringify(data),
  });