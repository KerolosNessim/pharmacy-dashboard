import type { LaravelPagination } from "./pagination";

export type CashStatus =
  | "delivery"
  | "received_from_driver"
  | "delivered_to_finance"
  | "refunded";

export type CashPaymentMethod = "cash" | "span" | "visa";

export interface CashFormPayload {
  amount: string;
  delivery_representative_id?: string;
  products_information: string;
  pharmacy_id: string;
  pharmacy_internal_invoice_number?: string;
  neighborhood: string;
  customer_name: string;
  mobile_no: string;
  location: string;
  notes?: string;
}

export interface CashActivityLogItem {
  id: number;
  action: string;
  from_status: string | null;
  to_status: string | null;
  performer_name?: string | null;
  notes?: string | null;
  metadata?: Record<string, unknown> | null;
  created_at: string;
}

export interface Cash {
  id: number;
  invoice_number: string | null;
  pharmacy_internal_invoice_number: string | null;
  amount: number;
  status: CashStatus | string;
  status_label?: string;
  payment_method?: CashPaymentMethod | string | null;
  payment_method_label?: string | null;
  is_refund?: boolean;
  pharmacy_id: number | null;
  pharmacy_name: string;
  delivery_representative_id: number | null;
  delivery_representative: {
    id: number;
    name: string;
    phone: string;
  } | null;
  products_information: string | null;
  neighborhood: string | null;
  customer_name: string | null;
  patient_id: string | null;
  pharmacist_id: string | null;
  mobile_no: string | null;
  location: string | null;
  share: string | null;
  notes: string | null;
  created_by: {
    id: number;
    name: string;
  };
  can_mark_received_from_driver?: boolean;
  can_mark_refund?: boolean;
  can_mark_submitted_to_finance?: boolean;
  activity_log?: CashActivityLogItem[];
  created_at: string;
  updated_at: string;
}

export interface AddCashResponse {
  status: string;
  message: string;
  data: Cash;
}

export interface GetCashResponse {
  status: string;
  message: string;
  data: {
    data: Cash[];
    pagination: LaravelPagination;
  };
}

export interface GetCashDetailResponse {
  status: string;
  message: string;
  data: Cash;
}

export interface GetCashLogsResponse {
  status: string;
  message: string;
  data: CashActivityLogItem[];
}
