
import { apiRequest, apiFormDataRequest } from "@/lib/api-request";
import { buildListQueryString } from "@/lib/list-query";
import { PRODUCTS_PER_PAGE } from "@/lib/api-pagination";
import { AddProductFileResponse, AddProductResponse, CategoryStatsResponse, DashboardStatsResponse, ProductsListResponse, SingleProductResponse } from "@/types/products";

export type ProductsListParams = {
  page?: number;
  per_page?: number;
  search?: string;
};

export const addProductApi = (data: FormData) =>
  apiFormDataRequest<AddProductResponse>("/products", data, "POST");

export const updateProductApi = (id: string, data: FormData) => {
  data.append("_method", "PUT");
  return apiFormDataRequest<AddProductResponse>(`/products/${id}`, data, "POST");
};

export const getCategoriesStatsApi = () =>
  apiRequest<CategoryStatsResponse>("/products/stats");

export const getDashboardStatsApi = () =>
  apiRequest<DashboardStatsResponse>("/dashboard/stats");

export const getProductsListApi = (search?: string, page = 1) => {
  const params: ProductsListParams = {
    page,
    per_page: PRODUCTS_PER_PAGE,
  };
  if (search?.trim()) params.search = search.trim();
  const query = buildListQueryString(params, { defaultPerPage: PRODUCTS_PER_PAGE });
  return apiRequest<ProductsListResponse>(`/products${query}`);
};

export const getSingleProductApi = (id: string) => {
  return apiRequest<SingleProductResponse>(`/products/${id}`);
};

export const checkAvailabilityApi = (id: string) => {
  return apiRequest<AddProductResponse>(`/inventory/${id}`, {
    method: "POST",
  });
};

export const deleteProductApi = (id: string) => {
  return apiRequest(`/products/${id}`, {
    method: "DELETE",
  });
};

export const addProductsBulkApi = (data: FormData) => {
  return apiFormDataRequest<AddProductFileResponse>(`/products/import`, data, "POST");
};
