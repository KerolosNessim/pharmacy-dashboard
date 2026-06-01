import { supervisorValues } from "@/components/supervisor/add-supervisor-form";
import { updateSupervisorValues } from "@/components/supervisor/update-supervisor-form";
import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import { addSupervisorResponse, getSupervisorsResponse } from "@/types/supervisor";

export type SupervisorsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  pharmacy_id?: string;
};

export const addSupervisorApi = (data: supervisorValues) =>
  apiRequest<addSupervisorResponse>("/supervisors", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getSupervisorApi = (queryParams?: SupervisorsListParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(([, v]) => v != null && v !== "")
  );
  const query = buildListQueryString(filteredParams);
  return apiRequest<getSupervisorsResponse>(`/supervisors${query}`, {
    method: "GET",
  });
};

export const toggleSupervisorStatusApi = (id: string) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}/toggle-status`, {
    method: "PATCH",
  });

export const updateSupervisorApi = (data: updateSupervisorValues, id: number) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteSupervisorApi = (id: string) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}`, {
    method: "DELETE",
  });
