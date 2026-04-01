import { apiRequest } from "@/lib/api-request";
import { GetNotificationsResponse, UnreadCountResponse } from "@/types/notifications";

export const getNotificationsApi = (page: number = 1, status: string = "unread") =>
  apiRequest<GetNotificationsResponse>(`/notifications?page=${page}&status=${status}`);

export const getUnreadCountApi = () =>
  apiRequest<UnreadCountResponse>(`/notifications/unread_count`);

export const markNotificationReadApi = (id: string) =>
  apiRequest(`/notifications/${id}/read`, { method: "POST" });

export const markAllNotificationsReadApi = () =>
  apiRequest(`/notifications/mark-all-read`, { method: "POST" });

export const deleteAllNotificationsApi = () =>
  apiRequest(`/notifications/delete-all`, { method: "DELETE" });
