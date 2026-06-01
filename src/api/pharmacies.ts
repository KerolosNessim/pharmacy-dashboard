import { pharmacyValues } from "@/components/pharmacies/add-pharmacy-form";
import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import { GetPharmaciesResponse, addPharmacyResponse } from "@/types/pharmacies";

export type PharmaciesListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
};

export const addPharmacyApi = (data: pharmacyValues) =>
  apiRequest<addPharmacyResponse>("/pharmacies", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getPharmaciesApi = (queryParams?: PharmaciesListParams) => {
  const filteredParams = Object.fromEntries(
    Object.entries(queryParams || {}).filter(([, v]) => v != null && v !== "")
  );
  const query = buildListQueryString(filteredParams);
  return apiRequest<GetPharmaciesResponse>(`/pharmacies${query}`, {
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

export const updatePharmacyApi = (id: string, data: pharmacyValues) =>
  apiRequest<GetPharmaciesResponse>(`/pharmacies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
