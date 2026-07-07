import { buildListQueryString } from "@/lib/list-query";
import { apiRequest } from "@/lib/api-request";
import {
  AddCashResponse,
  CashFormPayload,
  GetCashDetailResponse,
  GetCashLogsResponse,
  GetCashResponse,
} from "@/types/cash";

export type CashListParams = {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  from_date?: string;
  to_date?: string;
};

export type CashActionPayload = {
  payment_method?: "cash" | "span" | "visa";
  notes?: string;
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

export const getCashByIdApi = (id: number) =>
  apiRequest<GetCashDetailResponse>(`/cash-reimbursements/${id}`, {
    method: "GET",
  });

export const getCashLogsApi = (id: number) =>
  apiRequest<GetCashLogsResponse>(`/cash-reimbursements/${id}/logs`, {
    method: "GET",
  });

export const markCashReceivedFromDriverApi = (
  id: number,
  data: Required<Pick<CashActionPayload, "payment_method">> &
    Pick<CashActionPayload, "notes">,
) =>
  apiRequest<AddCashResponse>(
    `/cash-reimbursements/${id}/mark-received-from-driver`,
    {
      method: "POST",
      body: JSON.stringify(data),
    },
  );

export const markCashRefundApi = (
  id: number,
  data?: Pick<CashActionPayload, "notes">,
) =>
  apiRequest<AddCashResponse>(`/cash-reimbursements/${id}/mark-refund`, {
    method: "POST",
    body: JSON.stringify(data ?? {}),
  });

export const markCashSubmittedToFinanceApi = (
  id: number,
  data?: Pick<CashActionPayload, "notes">,
) =>
  apiRequest<AddCashResponse>(
    `/cash-reimbursements/${id}/mark-submitted-to-finance`,
    {
      method: "POST",
      body: JSON.stringify(data ?? {}),
    },
  );
