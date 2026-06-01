import { editPharmacistValues } from "@/components/pharmacists/edit-pharmaciest-form";
import { supervisorValues } from "@/components/supervisor/add-supervisor-form";
import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import { GetPharmacistsResponse } from "@/types/pharmacists";
import { addSupervisorResponse } from "@/types/supervisor";

export type PharmacistsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  pharmacy?: string;
};

export const addPharmacistApi = (data: supervisorValues) =>
  apiRequest<addSupervisorResponse>("/pharmacists", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPharmacistsApi = (queryParams?: PharmacistsListParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(([, v]) => v != null && v !== "")
  );
  const query = buildListQueryString(filteredParams);
  return apiRequest<GetPharmacistsResponse>(`/pharmacists${query}`, {
    method: "GET",
  });
};

export const togglePharmacistStatusApi = (id: string) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}/toggle-status`, {
    method: "PATCH",
  });

export const deletePharmacistApi = (id: string) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}`, {
    method: "DELETE",
  });

export const updatePharmacistApi = (id: string, data: editPharmacistValues) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
