import { Pharmacy } from "./pharmacies";

export type Supervisor = {
  id: number;
  name: string;
  email: string | null;
  id_number: string;
  fcm_token: string | null;
  role: string; 
  pharmacy_id: number;
  status: "active" | "inactive" | string;
  pharmacy?: Pharmacy;
};

export type SupervisorsPagination = {
  data: Supervisor[];
  current_page: number;
  last_page: number;
  total: number;
};

export type getSupervisorsResponse = {
  status: string; 
  message: string;
  data: SupervisorsPagination;
};

export type addSupervisorResponse = {
  status: string; 
  message: string;
  data: Supervisor;
};

