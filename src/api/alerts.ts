import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import { CreateAlertResponse, GetAlertsResponse } from "@/types/alerts";

export type AlertsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export const createAlertApi = (data: { title: string; body: string }) =>
  apiRequest<CreateAlertResponse>("/instructions", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getAlertsApi = (params?: AlertsListParams) => {
  const query = buildListQueryString(params ?? {});
  return apiRequest<GetAlertsResponse>(`/instructions${query}`);
};

export const deleteAlertApi = (id: string) =>
  apiRequest(`/instructions/${id}`, {
    method: "DELETE",
  });
