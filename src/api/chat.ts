import { apiRequest } from "@/lib/api-request";
import { InboxAdminResponse, InboxResponse, getMessagesResponse } from "@/types/chat";

export const sendMessageApi = (data: FormData) =>
  apiRequest("/chat/send", {
    method: "POST",
    body: data,
  });

  export const getMessagesApi = (pharmacyId: string) =>
    apiRequest<getMessagesResponse>(`/chat/messages/${pharmacyId}`);

    export const getInboxApi = () =>
      apiRequest<InboxResponse>(`/chat/my-messages`);
    export const getAdminInboxApi = () =>
      apiRequest<InboxAdminResponse>(`/chats`);