import { pharmacyValues } from "@/components/pharmacies/add-pharmacy-form";
import { apiRequest } from "@/lib/api-request";
import { GetPharmaciesResponse, addPharmacyResponse } from "@/types/pharmacies";

export const addPharmacyApi = (data: pharmacyValues) =>
  apiRequest<addPharmacyResponse>("/pharmacies", {
    method: "POST",
    body: JSON.stringify(data),
  });

  export const getPharmaciesApi = () =>
    apiRequest<GetPharmaciesResponse>(`/pharmacies`, {
      method: "GET",
    });

    export const deletePharmacyApi = (id: string) =>
    apiRequest<GetPharmaciesResponse>(`/pharmacies/${id}`, {
      method: "DELETE",
    });

    export const updatePharmacyStatusApi = (id: string) =>
    apiRequest<GetPharmaciesResponse>(`/pharmacies/${id}/toggle-status`, {
      method: "PATCH",
    });
    export const updatePharmacyApi = (id: string , data: pharmacyValues) =>
    apiRequest<GetPharmaciesResponse>(`/pharmacies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });