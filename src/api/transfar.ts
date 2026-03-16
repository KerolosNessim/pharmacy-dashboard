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