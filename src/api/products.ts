import { ProductFormValues } from "@/components/import-product/add-product-form";
import { apiRequest } from "@/lib/api-request";
import { AddProductResponse, CategoryStatsResponse, ProductsListResponse, SingleProductResponse } from "@/types/products";



export const addProductApi = (data: ProductFormValues) =>
  apiRequest<AddProductResponse>("/super-admin/products", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const getCategoriesStatsApi = () =>
  apiRequest<CategoryStatsResponse>("/super-admin/products/stats");


export const getProductsListApi = (search?: string) => {
  const query = search ? `?search=${search}` : "";
  return apiRequest<ProductsListResponse>(`/products${query}`);
}
export const getSingleProductApi = (id: string) => {
  return apiRequest<SingleProductResponse>(`/products/${id}`);
}
