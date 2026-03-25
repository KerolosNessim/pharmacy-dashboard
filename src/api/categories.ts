import { categoyValues } from "@/components/categories/add-category-form";
import { apiRequest } from "@/lib/api-request";
import { addCategoryResponse, getCategoriesResponse } from "@/types/categories";

export const addCategoryApi = (data: categoyValues) =>
  apiRequest<addCategoryResponse>("/categories", {
    method: "POST",
    body: JSON.stringify(data),
  });

  export const getCategoriesApi = () =>
    apiRequest<getCategoriesResponse>("/categories", {
      method: "GET",
    });


