import { apiRequest } from "@/lib/api-request";
import { taskValues } from "@/components/tasks/add-task-mauel";
import { addCategoryResponse } from "@/types/categories";
import { getSingleTaskResponse, getTasksResponse } from "@/types/tasks";

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
export const getTasksApi = (params?: string) =>
  apiRequest<getTasksResponse>(`/refill-tasks${params}`, {
    method: "GET",
  });
export const getSingleTaskApi = (id: string) =>
  apiRequest<getSingleTaskResponse>(`/refill-tasks${id}`, {
    method: "GET",
  });
export const uploadTaskResultApi = (id: string, data: FormData) =>
  apiRequest<getSingleTaskResponse>(`/refill-tasks/${id}/submit-result`, {
    method: "POST",
    body: data,
  });