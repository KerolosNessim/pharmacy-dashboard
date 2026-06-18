import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import { AddCashResponse, CashFormPayload, GetCashResponse } from "@/types/cash";

export type CashListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
};

export const addCashApi = (data: CashFormPayload) =>
  apiRequest<AddCashResponse>("/cash-reimbursements", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const updateCashApi = (id: number, data: CashFormPayload) =>
  apiRequest<AddCashResponse>(`/cash-reimbursements/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });

export const deleteCashApi = (id: number) =>
  apiRequest<AddCashResponse>(`/cash-reimbursements/${id}`, {
    method: "DELETE",
  });

export const getCashApi = (params?: CashListParams) => {
  const query = buildListQueryString(params ?? {});
  return apiRequest<GetCashResponse>(`/cash-reimbursements${query}`, {
    method: "GET",
  });
};
