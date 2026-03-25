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