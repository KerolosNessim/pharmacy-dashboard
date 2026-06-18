import type { LaravelPagination } from "./pagination";

export interface CashFormPayload {
  amount: string;
  status?: "delivery" | "received_from_driver" | "delivered_to_finance";
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

export interface Cash {
  id: number;
  invoice_number: string | null;
  pharmacy_internal_invoice_number: string | null;
  amount: number;
  status: string;
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
