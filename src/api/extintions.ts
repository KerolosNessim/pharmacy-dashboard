import { ClinicValues } from "@/components/extintions/add-clinic-form";
import { DepartmentValues } from "@/components/extintions/add-department-form";
import { DoctorExtensionValues } from "@/components/extintions/add-doctor-ex-form";
import { apiRequest } from "@/lib/api-request";
import { ClinicResponse, addClinicResponse, addDepartmentResponse, addDoctorExtensionResponse, getDepartmentsResponse } from "@/types/extintions";

export const addDepartmentApi = (data: DepartmentValues) =>
  apiRequest<addDepartmentResponse>("/medical-departments", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const addClinicApi = (data: ClinicValues) =>
  apiRequest<addClinicResponse>("/clinics", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const addDoctorApi = (data: DoctorExtensionValues) =>
  apiRequest<addDoctorExtensionResponse>("/doctors", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const getDepartmentsApi = () =>
  apiRequest<getDepartmentsResponse>("/medical-departments", {
    method: "GET",
  });
export const getClinicsApi = () =>
  apiRequest<ClinicResponse>("/clinics", {
    method: "GET",
  });