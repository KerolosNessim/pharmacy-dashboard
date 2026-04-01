"use client";

import { Notification } from "@/types/notifications";
import { Bell, BellDot, Check } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface NotificationCardProps {
  notification: Notification;
  onMarkRead?: (id: string) => void;
}

export default function NotificationCard({
  notification,
  onMarkRead,
}: NotificationCardProps) {
  const isRead = !!notification.read_at;
  const timeAgo = formatDistanceToNow(new Date(notification.created_at), {
    addSuffix: true,
  });

  return (
    <div
      className={cn(
        "flex items-start gap-4 p-4 rounded-xl border transition-colors duration-200",
        isRead
          ? "bg-background border-border"
          : "bg-primary/5 border-primary/20"
      )}
    >
      {/* Icon */}
      <div
        className={cn(
          "shrink-0 w-10 h-10 rounded-full flex items-center justify-center",
          isRead ? "bg-muted" : "bg-primary/10"
        )}
      >
        {isRead ? (
          <Bell className="w-5 h-5 text-muted-foreground" />
        ) : (
          <BellDot className="w-5 h-5 text-primary" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <div>
            <p
              className={cn(
                "text-sm leading-snug",
                isRead ? "font-normal text-foreground" : "font-semibold text-foreground"
              )}
            >
              {notification.data.title}
            </p>
            <p className="text-sm text-muted-foreground mt-0.5 line-clamp-2">
              {notification.data.body}
            </p>
          </div>

          {/* Unread dot */}
          {!isRead && (
            <span className="mt-1 shrink-0 w-2 h-2 rounded-full bg-primary" />
          )}
        </div>

        <div className="flex items-center justify-between mt-2">
          <span className="text-xs text-muted-foreground">{timeAgo}</span>

          {!isRead && onMarkRead && (
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-primary hover:text-primary hover:bg-primary/10 gap-1"
              onClick={() => onMarkRead(notification.id)}
            >
              <Check className="w-3 h-3" />
              Mark read
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
