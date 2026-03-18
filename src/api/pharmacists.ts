import { apiRequest } from "@/lib/api-request";
import { AddPharmacistResponse, GetPharmacistsResponse, pharmacistValues } from "@/types/pharmacists";

export const addPharmacistApi = (data: pharmacistValues) =>
  apiRequest<AddPharmacistResponse>("/super-admin/pharmacists", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getPharmacistsApi = () =>
  apiRequest<GetPharmacistsResponse>("/super-admin/pharmacists", {
    method: "GET",
  });
