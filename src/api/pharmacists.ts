import { supervisorValues } from "@/components/supervisor/add-supervisor-form";
import { apiRequest } from "@/lib/api-request";
import { addSupervisorResponse, getSupervisorsResponse } from "@/types/supervisor";

export const addPharmacistApi = (data: supervisorValues) =>
  apiRequest<addSupervisorResponse>("/super-admin/pharmacists", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getPharmacistsApi = () =>
  apiRequest<getSupervisorsResponse>("/super-admin/pharmacists", {
    method: "GET",
  });
