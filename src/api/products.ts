
import { apiRequest, apiFormDataRequest } from "@/lib/api-request";
import { AddProductFileResponse, AddProductResponse, CategoryStatsResponse, DashboardStatsResponse, ProductsListResponse, SingleProductResponse } from "@/types/products";

export const addProductApi = (data: FormData) =>
  apiFormDataRequest<AddProductResponse>("/products", data, "POST");

export const updateProductApi = (id: string, data: FormData) => {
  data.append("_method", "PUT");
  return apiFormDataRequest<AddProductResponse>(`/products/${id}`, data, "POST");
}

export const getCategoriesStatsApi = () =>
  apiRequest<CategoryStatsResponse>("/products/stats");
export const getDashboardStatsApi = () =>
  apiRequest<DashboardStatsResponse>("/dashboard/stats");


export const getProductsListApi = (search?: string) => {
  const query = search ? `?search=${search}` : "";
  return apiRequest<ProductsListResponse>(`/products${query}`);
}
export const getSingleProductApi = (id: string) => {
  return apiRequest<SingleProductResponse>(`/products/${id}`);
}

export const checkAvailabilityApi = (id: string) => {
  return apiRequest<AddProductResponse>(`/inventory/${id}`, {
    method: "POST",
  });
}
export const deleteProductApi = (id: string) => {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}
export const addProductsBulkApi = (data: FormData) => {
  return apiFormDataRequest<AddProductFileResponse>(`/products/import`, data, "POST");
}

