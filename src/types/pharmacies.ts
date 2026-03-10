import { Supervisor } from "./supervisor";

export type addPharmacyResponse={
  status: string;
  message: string;
  data:{
  id: number;
  name: string;
  address: string;
  phone: string;
  created_at: string;
  updated_at: string;
};
}

export type Pharmacy = {
  id: number;
  name: string;
  address: string;
  phone: string;
  city: string | null;
  area: string | null;
  status: string;
  created_at: string;
  updated_at: string;
  supervisor: Supervisor| null;
};

export type PharmaciesPagination = {
  data: Pharmacy[];
  current_page: number;
  last_page: number;
  total: number;
};

export type GetPharmaciesResponse = {
  status: string;
  message: string;
  data: PharmaciesPagination;
};