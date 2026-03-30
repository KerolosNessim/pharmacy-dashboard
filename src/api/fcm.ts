import { apiRequest } from "@/lib/api-request";

export const subscribeToTopicApi = (token: string, topic: string = "all_users") =>
  apiRequest("/fcm/subscribe", {
    method: "POST",
    body: JSON.stringify({ token, topic }),
  });
