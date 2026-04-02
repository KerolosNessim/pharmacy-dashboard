import { apiRequest } from "@/lib/api-request";
import { CreateAlertResponse, GetAlertsResponse } from "@/types/alerts";

export const createAlertApi = (data: { title: string; body: string }) =>
  apiRequest<CreateAlertResponse>("/instructions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAlertsApi = () =>
  apiRequest <GetAlertsResponse>("/instructions");

export const deleteAlertApi = (id: string) =>
  apiRequest(`/instructions/${id}`, {
    method: "DELETE",
  });