import { pharmacyValues } from "@/components/pharmacies/add-pharmacy-form";
import { apiRequest } from "@/lib/api-request";
import { GetPharmaciesResponse, addPharmacyResponse } from "@/types/pharmacies";

export const addPharmacyApi = (data: pharmacyValues) =>
  apiRequest<addPharmacyResponse>("/pharmacies", {
    method: "POST",
    body: JSON.stringify(data),
  });

  export const getPharmaciesApi = (queryParams?: { search?: string; status?: string }) => {
    const filteredParams = Object.fromEntries(
      Object.entries(queryParams || {}).filter(([, v]) => v != null && v !== "")
    );
    if(Object.keys(filteredParams).length === 0){
      return apiRequest<GetPharmaciesResponse>(`/pharmacies`, {
        method: "GET",
      });
    }
    return apiRequest<GetPharmaciesResponse>(`/pharmacies?${new URLSearchParams(filteredParams)}`, {
      method: "GET",
    });
  };

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