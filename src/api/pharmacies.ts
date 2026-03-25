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