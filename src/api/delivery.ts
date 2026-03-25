import { deliveryValues } from "@/components/delivery/add-delivery-form";
import { apiRequest } from "@/lib/api-request";
import { AddDeliveryResponse, GetDeliveriesResponse } from "@/types/delivery";



export const getDeliveriesApi = () =>
  apiRequest<GetDeliveriesResponse>("/delivery-representatives?all=true", {
    method: "GET",
  });

export const addDeliveryApi = (data: deliveryValues) =>
  apiRequest<AddDeliveryResponse>("/delivery-representatives", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const deleteDeliveryApi = (id: number) =>
  apiRequest<AddDeliveryResponse>(`/delivery-representatives/${id}`, {
    method: "DELETE",
  });

export const updateDeliveryApi = (id: number, data: deliveryValues) =>
  apiRequest<AddDeliveryResponse>(`/delivery-representatives/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });