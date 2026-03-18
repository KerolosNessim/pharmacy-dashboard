import { Pharmacy } from "./pharmacies";

export type Pharmacist = {
  id: number;
  name: string;
  id_number: string;
  pharmacy_id: number;
  status: string;
  created_at: string;
  updated_at: string;
  pharmacy?: Pharmacy;
};

export type pharmacistValues = {
  name: string;
  id_number: string;
  password: string;
  pharmacy_id: string;
};

export type PharmacistsPagination = {
  data: Pharmacist[];
  current_page: number;
  last_page: number;
  total: number;
};

export type GetPharmacistsResponse = {
  status: string;
  message: string;
  data: PharmacistsPagination;
};

export type AddPharmacistResponse = {
  status: string;
  message: string;
  data: Pharmacist;
};
