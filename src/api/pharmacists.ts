import { editPharmacistValues } from "@/components/pharmacists/edit-pharmaciest-form";
import { supervisorValues } from "@/components/supervisor/add-supervisor-form";
import { apiRequest } from "@/lib/api-request";
import { GetPharmacistsResponse } from "@/types/pharmacists";
import { addSupervisorResponse } from "@/types/supervisor";

export const addPharmacistApi = (data: supervisorValues) =>
  apiRequest<addSupervisorResponse>("/pharmacists", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getPharmacistsApi = () =>
  apiRequest<GetPharmacistsResponse>("/pharmacists", {
    method: "GET",
  });
export const togglePharmacistStatusApi = (id:string) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}/toggle-status`, {
    method: "PATCH",
  });
export const deletePharmacistApi = (id:string) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}`, {
    method: "DELETE",
  });

  export const updatePharmacistApi = (id:string,data: editPharmacistValues) =>
  apiRequest<addSupervisorResponse>(`/pharmacists/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });