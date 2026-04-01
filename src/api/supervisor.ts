import { supervisorValues } from "@/components/supervisor/add-supervisor-form";
import { updateSupervisorValues } from "@/components/supervisor/update-supervisor-form";
import { apiRequest } from "@/lib/api-request";
import { addSupervisorResponse, getSupervisorsResponse } from "@/types/supervisor";

export const addSupervisorApi = (data: supervisorValues) =>
  apiRequest<addSupervisorResponse>("/supervisors", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getSupervisorApi = (queryParams?: { search?: string; status?: string; pharmacy_id?: string }) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(([, v]) => v != null && v !== "")
  );
  return apiRequest<getSupervisorsResponse>(`/supervisors?${new URLSearchParams(filteredParams)}`, {
    method: "GET",
  });
};
export const toggleSupervisorStatusApi = (id:string) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}/toggle-status`, {
    method: "PATCH",
  });

  
export const updateSupervisorApi = (data: updateSupervisorValues,id:number) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

  export const deleteSupervisorApi = (id: string) =>
  apiRequest<addSupervisorResponse>(`/supervisors/${id}`, {
    method: "DELETE",
  });