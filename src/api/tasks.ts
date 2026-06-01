import { apiRequest } from "@/lib/api-request";
import { buildListQueryString } from "@/lib/list-query";
import { taskValues } from "@/components/tasks/add-task-mauel";
import { addCategoryResponse } from "@/types/categories";
import { getSingleTaskResponse, getTasksResponse } from "@/types/tasks";

export type RefillTasksListParams = {
  page?: number;
  per_page?: number;
  status?: string;
  search?: string;
  from_date?: string;
  to_date?: string;
};

export const addTaskApi = (data: taskValues) =>
  apiRequest<addCategoryResponse>("/refill-tasks", {
    method: "POST",
    body: JSON.stringify(data),
  });

export const addTaskBulkApi = (formData: FormData) =>
  apiRequest<addCategoryResponse>("/refill-tasks/import", {
    method: "POST",
    body: formData,
  });

export const getTasksApi = (params?: RefillTasksListParams | string) => {
  const query =
    typeof params === "string"
      ? params.startsWith("?")
        ? params
        : params
          ? `?${params}`
          : buildListQueryString({})
      : buildListQueryString(params ?? {});
  return apiRequest<getTasksResponse>(`/refill-tasks${query}`, {
    method: "GET",
  });
};

export const getSingleTaskApi = (id: string) =>
  apiRequest<getSingleTaskResponse>(`/refill-tasks${id}`, {
    method: "GET",
  });

export const uploadTaskResultApi = (id: string, data: FormData) =>
  apiRequest<getSingleTaskResponse>(`/refill-tasks/${id}/submit-result`, {
    method: "POST",
    body: data,
  });
