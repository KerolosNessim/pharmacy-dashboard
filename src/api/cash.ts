import { cashValues } from "@/components/cash/add-cash-form";
import { apiRequest } from "@/lib/api-request";
import { AddCashResponse, GetCashResponse } from "@/types/cash";




export const addCashApi = (data: cashValues) =>
  apiRequest<AddCashResponse>("/cash-reimbursements", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const updateCashApi = (id: number, data: cashValues) =>
  apiRequest<AddCashResponse>("/cash-reimbursements/" + id, {
    method: "PUT",
    body: JSON.stringify(data),
  });
export const deleteCashApi = (id: number) =>
  apiRequest<AddCashResponse>("/cash-reimbursements/" + id, {
    method: "DELETE",
  });
export const getCashApi = () =>
  apiRequest<GetCashResponse>("/cash-reimbursements", {
    method: "GET",
  });

