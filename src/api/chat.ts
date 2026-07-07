import { apiFormDataRequest, apiRequest } from "@/lib/api-request";
import { AdminSingleInboxResponse, InboxAdminResponse, InboxResponse, getMessagesResponse } from "@/types/chat";

export const sendMessageApi = (data: FormData) =>
  apiFormDataRequest("/chat/send", data, "POST");

  export const getMessagesApi = (pharmacyId: string) =>
    apiRequest<getMessagesResponse>(`/chat/messages/${pharmacyId}`);

    export const getInboxApi = () =>
  apiRequest<InboxResponse>(`/chat/my-messages`);
    

    export const getAdminInboxApi = () =>
  apiRequest<InboxAdminResponse>(`/chats`);
    
    export const getAdminSingleInboxApi = (id: string) =>
      apiRequest<AdminSingleInboxResponse>(`/chats/${id}`);