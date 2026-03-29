import { categoyValues } from "@/components/categories/add-category-form";
import { SubcategoyValues } from "@/components/categories/add-subcategory-form";
import { editCategoryValues } from "@/components/categories/edit-category-form";
import { apiRequest } from "@/lib/api-request";
import { addCategoryResponse, getCategoriesResponse } from "@/types/categories";

export const addCategoryApi = (data: categoyValues) =>
  apiRequest<addCategoryResponse>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });
export const addSubCategoryApi = (data: SubcategoyValues) =>
  apiRequest<addCategoryResponse>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

  export const getCategoriesApi = () =>
    apiRequest<getCategoriesResponse>("/categories", {
      method: "GET",
    });

    export const deleteCategoriesApi = (id: string) =>
    apiRequest<getCategoriesResponse>(`/categories/${id}`, {
      method: "DELETE",
    });

    export const updateCategoryApi = (data: editCategoryValues ,id:string) =>
    apiRequest<addCategoryResponse>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });


    export const updateSubCategoryApi = (data: editCategoryValues ,id:string) =>
    apiRequest<addCategoryResponse>(`/categories/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
