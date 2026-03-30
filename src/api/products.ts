import { ProductFormValues } from "@/components/import-product/add-product-form";
import { apiRequest } from "@/lib/api-request";
import { AddProductFileResponse, AddProductResponse, CategoryStatsResponse, DashboardStatsResponse, ProductsListResponse, SingleProductResponse } from "@/types/products";



export const addProductApi = (data: ProductFormValues) =>
  apiRequest<AddProductResponse>("/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

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
  return apiRequest(`/inventory/${id}`, {
    method: "POST",
  });
}
export const deleteProductApi = (id: string) => {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
}
export const addProductsBulkApi = (data: FormData) => {
  return apiRequest<AddProductFileResponse>(`/products/import`, {
    method: "POST",
    body: data,
  });
}

