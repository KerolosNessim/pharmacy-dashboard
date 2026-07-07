import type { Notification } from "@/types/notifications";
import { toast } from "sonner";

export function showNotificationToast(
  notification: Pick<Notification, "data"> | { title?: string; body?: string },
) {
  const title =
    ("data" in notification ? notification.data?.title : notification.title) ||
    "New Notification";
  const body =
    ("data" in notification ? notification.data?.body : notification.body) ||
    "You have a new update";

  toast(title, {
    description: body,
    duration: 6000,
  });
}
